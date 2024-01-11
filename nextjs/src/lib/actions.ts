"use server";

import prisma from "@nextjs/lib/prisma";
import { revalidateTag } from "next/cache";
import { getServerAuthSession } from "@nextjs/lib/auth";
import {
  addDomainToVercel,
  removeDomainFromVercelProject,
  validDomainRegex,
} from "@nextjs/lib/domains";
import { type User, type Community } from "@prisma/client";
import { getColorForName } from "./utils";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { blacklist } from "./actions.blacklist";

// Define an interface for the successful update result
interface SuccessResult<T> {
  success: true;
  message: string;
  data?: T; // Optionally include data related to the update
}

// Define an interface for the update result containing an error
interface ErrorResult {
  success: false;
  message: string;
  errorCode?: string; // Optional code indicating the type of error
  errorField?: string; // Optional field that caused the error
  errorDetails?: any; // Additional details about the error
}

// Create a type that encompasses both possible results
export type ActionResult<T> = SuccessResult<T> | ErrorResult;

export const updateUser = async (
  data: Partial<User>,
): Promise<ActionResult<string>> => {
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

export const createCommunity = async (
  data: Pick<Community, "name" | "subdomain" | "description">,
): Promise<ActionResult<Community>> => {
  const session = await getServerAuthSession();
  if (!session?.user.id) {
    return {
      success: false,
      message: "Not authenticated",
    };
  }
  const avatarClass = getColorForName(data.name);
  data.subdomain = data.subdomain.trim().toLowerCase();

  if (data.subdomain.length < 4) {
    return {
      success: false,
      errorField: "subdomain",
      message: "Subdomain must be at least 4 characters",
    };
  }

  if (blacklist.indexOf(data.subdomain.toLowerCase()) !== -1) {
    return {
      success: false,
      errorField: "subdomain",
      message: "This name is reserved and cannot be used",
    };
  }

  try {
    const response = await prisma.community.create({
      data: {
        name: data.name,
        subdomain: data.subdomain,
        description: data.description,
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
      `${data.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
    );

    return {
      success: true,
      message: "Community created successfully",
      data: response,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (error.code === "P2002") {
      return {
        success: false,
        message: `This subdomain is already taken`,
        errorField: "subdomain",
      };
    } else {
      return {
        success: false,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        message: error.message ?? error,
      };
    }
  }
};

export const updateCommunity = async (
  data: Partial<Community>,
): Promise<ActionResult<Community>> => {
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

    if (data.customDomain) {
      data.customDomain = data.customDomain.trim().toLowerCase();
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
      },
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
      if (
        updatedCommunityData.customDomain &&
        validDomainRegex.test(updatedCommunityData.customDomain)
      ) {
        await Promise.all([
          addDomainToVercel(updatedCommunityData.customDomain),
        ]);
      }
      if (
        communityData.customDomain &&
        validDomainRegex.test(communityData.customDomain)
      ) {
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
        message: prettifyError(error),
        errorCode: error.code,
        errorField: (error.meta?.target as string)[0],
      };
    }
    return {
      success: false,
      message: "An unknown error occurred",
    };
  }
};

const prettifyError = (error: PrismaClientKnownRequestError): string => {
  if (error.code === "P2002") {
    switch ((error.meta?.target as string)[0]) {
      case "subdomain":
        return "This subdomain is already taken";
      case "customDomain":
        return "This domain is already taken";
      default:
        return error.message;
    }
  }
  return error.message;
}