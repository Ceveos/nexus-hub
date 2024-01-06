"use server";

import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import { getServerAuthSession } from "@/lib/auth";
import {
  addDomainToVercel,
  removeDomainFromVercelProject,
  validDomainRegex,
} from "@/lib/domains";
import { type User, type Community } from "@prisma/client";
import { getColorForName } from "./utils";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export const createCommunity = async (formData: FormData) => {
  const session = await getServerAuthSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }
  const name = formData.get("name") as string;
  const subdomain = formData.get("subdomain") as string;
  const description = formData.get("description") as string;
  const avatarClass = getColorForName(name);

  if (subdomain.length < 4) {
    return {
      error: "Subdomain must be at least 4 characters",
    };
  }

  try {
    const response = await prisma.community.create({
      data: {
        name,
        subdomain,
        description,
        avatarClass,
        owner: {
          connect: {
            id: session.user.id,
          },
        },
        members: {
          create: {
            user: {
              connect: {
                id: session.user.id,
              },
            },
            role: "ADMIN",
          },
        },
      },
    });
    revalidateTag(
      `${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
    );
    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (error.code === "P2002") {
      return {
        error: `This subdomain is already taken`,
      };
    } else {
      return {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        error: error.message,
      };
    }
  }
};

// Define an interface for the successful update result
interface SuccessUpdateResult {
  success: true;
  message: string;
  data?: any; // Optionally include data related to the update
}

// Define an interface for the update result containing an error
interface ErrorUpdateResult {
  success: false;
  message: string;
  errorCode?: string; // Optional code indicating the type of error
  errorDetails?: any; // Additional details about the error
}

// Create a type that encompasses both possible results
export type UpdateResult = SuccessUpdateResult | ErrorUpdateResult;

export const updateUser = async (
  data: Partial<User>,
): Promise<UpdateResult> => {
  const session = await getServerAuthSession();
  if (!session?.user.id) {
    return {
      success: false,
      message: "Not authenticated",
    };
  }

  try {
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data,
    });

    return {
      success: true,
      message: "User updated",
    };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      return {
        success: false,
        message: error.message,
        errorCode: error.code,
        errorDetails: error.meta,
      };
    }
    return {
      success: false,
      message: "An unknown error occurred",
    };
  }
};

export const updateCommunity = async (
  data: Partial<Community>,
): Promise<UpdateResult> => {
  try {
    const session = await getServerAuthSession();
    if (!session?.user.id) {
      return {
        success: false,
        message: "Not authenticated",
      };
    }

    if (!data.id) {
      return {
        success: false,
        message: "Community ID is required",
      };
    }
    
    if (data.customDomain && !validDomainRegex.test(data.customDomain)) {
      return {
        success: false,
        message: "Custom domain is invalid",
      };
    }

    const communityData = await prisma.community.findUnique({
      where: {
        id: data.id,
      }
    });

    if (!communityData || communityData.ownerId !== session.user.id) {
      return {
        success: false,
        message: "Not authorized",
      };
    }

    // Update where community ID == data.id, and owner is user
    const updatedCommunityData = await prisma.community.update({
      where: {
        id: data.id,
        ownerId: session.user.id,
      },
      data,
    });

    revalidateTag(`${data.id}-metadata`);
    if (communityData.customDomain !== updatedCommunityData.customDomain) {
      revalidateTag(`${communityData.customDomain}-metadata`);
      revalidateTag(`${updatedCommunityData.customDomain}-metadata`);
    }
    if (communityData.subdomain !== updatedCommunityData.subdomain) {
      revalidateTag(`${communityData.subdomain}-metadata`);
      revalidateTag(`${updatedCommunityData.subdomain}-metadata`);
    }

    if (updatedCommunityData.customDomain !== communityData.customDomain) {
      if (updatedCommunityData.customDomain && validDomainRegex.test(updatedCommunityData.customDomain)) {
        await Promise.all([
          addDomainToVercel(updatedCommunityData.customDomain),
        ]);
      }
      if (communityData.customDomain && validDomainRegex.test(communityData.customDomain)) {
        await Promise.all([
          removeDomainFromVercelProject(communityData.customDomain),
        ]);
      }
    }

    return {
      success: true,
      message: "Community updated",
    };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      return {
        success: false,
        message: error.message,
        errorCode: error.code,
        errorDetails: error.meta,
      };
    }
    return {
      success: false,
      message: "An unknown error occurred",
    };
  }
};
