import { z } from "zod";

export const AddAddressSchema = z.object({
  district: z.string(),
  city: z.string(),
  postCode: z.number(),
  details: z.string(),
});

export const ProfileSchema = z.object({
  image: z.string().optional(),
  phone: z.string().optional(),
  defaultAddress: z.string().optional(),
});

export const AddressSchema = z.object({
  district: z.string(),
  city: z.string(),
  postCode: z.number(),
  details: z.string(),
});
