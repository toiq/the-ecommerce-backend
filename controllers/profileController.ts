import { Request, Response } from "express";
import prismaClient from "../dbclients/prismaClient.js";
import { NotFoundException } from "../exceptions/not-found.js";
import { ErrorCode } from "../exceptions/root.js";
import { ProfileSchema, AddressSchema } from "../schema/profileSchema.js";
import { BadRequestException } from "../exceptions/bad-request.js";

// Get profile by authenticated user
export const getProfile = async (req: Request, res: Response) => {
  let profile = await prismaClient.profile.findUnique({
    where: {
      userId: req.user.id,
    },
    include: {
      defaultAddress: true,
      addresses: true,
    },
  });

  res.status(200).json({
    success: true,
    profile: profile,
  });
};

// Update profile by authenticated user
export const updateProfile = async (req: Request, res: Response) => {
  const data = ProfileSchema.parse(req.body);

  const image = req.fileUrls?.["profile-image"] || undefined;

  const isUsersAddress = await prismaClient.profile.findFirst({
    where: {
      addresses: {
        some: {
          id: data.defaultAddress,
        },
      },
      userId: req.user.id,
    },
  });

  console.log({ isUsersAddress });

  if (!isUsersAddress) {
    throw new BadRequestException(
      "The address does not belong to the user.",
      ErrorCode.ADDRESS_DOES_NOT_BELONG
    );
  }

  const updatedProfile = await prismaClient.profile.update({
    where: {
      userId: req.user.id,
    },
    data: {
      ...data,
      image,
      defaultAddress: data.defaultAddress
        ? {
            connect: {
              id: data.defaultAddress,
            },
          }
        : undefined, // Set undefined if there's no address to connect
    },
  });

  res.status(200).json({
    success: true,
    message: "Profile updated successfully.",
    profile: updatedProfile,
  });
};

// Add an address to the profile
export const addAddress = async (req: Request, res: Response) => {
  const data = AddressSchema.parse(req.body);

  const profile = await prismaClient.profile.findUnique({
    where: {
      userId: req.user.id,
    },
  });

  if (!profile) {
    throw new NotFoundException("Profile not found", ErrorCode.USER_NOT_FOUND);
  }

  const newAddress = await prismaClient.address.create({
    data: {
      district: data.district,
      city: data.city,
      postCode: data.postCode,
      details: data.details,
      profileId: profile.id,
    },
  });

  res.status(201).json({
    success: true,
    message: "Address added successfully.",
    address: newAddress,
  });
};

// Update address
export const updateAddress = async (req: Request, res: Response) => {
  const { addressId } = req.params;
  const data = AddressSchema.parse(req.body);

  const address = await prismaClient.address.findUnique({
    where: {
      id: addressId,
      profile: {
        userId: req.user.id,
      },
    },
  });

  if (!address) {
    throw new NotFoundException(
      "Address not found",
      ErrorCode.ADDRESS_NOT_FOUND
    );
  }

  const updatedAddress = await prismaClient.address.update({
    where: {
      id: addressId,
    },
    data,
  });

  res.status(200).json({
    success: true,
    message: "Address updated successfully.",
    address: updatedAddress,
  });
};

// Delete address
export const deleteAddress = async (req: Request, res: Response) => {
  const { addressId } = req.params;

  const address = await prismaClient.address.findUnique({
    where: {
      id: addressId,
    },
  });

  if (!address) {
    throw new NotFoundException(
      "Address not found",
      ErrorCode.ADDRESS_NOT_FOUND
    );
  }

  await prismaClient.address.delete({
    where: {
      id: addressId,
    },
  });

  res.status(200).json({
    success: true,
    message: "Address deleted successfully.",
  });
};
