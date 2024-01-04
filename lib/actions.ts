"use server";

import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import { withSiteAuth } from "./auth";
import { getServerAuthSession } from "@/lib/auth";
import {
  addDomainToVercel,
  // getApexDomain,
  removeDomainFromVercelProject,
  // removeDomainFromVercelTeam,
  validDomainRegex,
} from "@/lib/domains";
import { type Site } from "@prisma/client";
import { getColorForName } from "./utils";
import { type UserFormData } from "./schemas/userSchema";

export const createSite = async (formData: FormData) => {
  const session = await getServerAuthSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const subdomain = formData.get("subdomain") as string;

  try {
    const response = await prisma.site.create({
      data: {
        name,
        description,
        subdomain,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });
    revalidateTag(
      `${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`
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
              }
            },
            role:"ADMIN"
          }
        }
      },
    });
    revalidateTag(
      `${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`
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

export const updateSite = withSiteAuth(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async (formData: FormData | null, site: Site, key: string | null): Promise<any> => {
    const value = formData?.get(key!) as string;

    try {
      let response;
      if (validDomainRegex.test(value)) {
          response = await prisma.site.update({
            where: {
              id: site.id,
            },
            data: {
              customDomain: value,
            },
          });
          await Promise.all([
            addDomainToVercel(value),
            // Optional: add www subdomain as well and redirect to apex domain
            // addDomainToVercel(`www.${value}`),
          ]);

          // empty value means the user wants to remove the custom domain
        } else if (value === "") {
          response = await prisma.site.update({
            where: {
              id: site.id,
            },
            data: {
              customDomain: null,
            },
          });
        }

        // if the site had a different customDomain before, we need to remove it from Vercel
        if (site.customDomain && site.customDomain !== value) {
          response = await removeDomainFromVercelProject(site.customDomain);

          /* Optional: remove domain from Vercel team 

          // first, we need to check if the apex domain is being used by other sites
          const apexDomain = getApexDomain(`https://${site.customDomain}`);
          const domainCount = await prisma.site.count({
            where: {
              OR: [
                {
                  customDomain: apexDomain,
                },
                {
                  customDomain: {
                    endsWith: `.${apexDomain}`,
                  },
                },
              ],
            },
          });

          // if the apex domain is being used by other sites
          // we should only remove it from our Vercel project
          if (domainCount >= 1) {
            await removeDomainFromVercelProject(site.customDomain);
          } else {
            // this is the only site using this apex domain
            // so we can remove it entirely from our Vercel team
            await removeDomainFromVercelTeam(
              site.customDomain
            );
          }
          
          */
        // }
      // } else if (key === "image" || key === "logo") {
      //   if (!process.env.BLOB_READ_WRITE_TOKEN) {
      //     return {
      //       error:
      //         "Missing BLOB_READ_WRITE_TOKEN token. Note: Vercel Blob is currently in beta – please fill out this form for access: https://tally.so/r/nPDMNd",
      //     };
      //   }

      //   const file = formData.get(key) as File;
      //   const filename = `${nanoid()}.${file.type.split("/")[1]}`;

      //   const { url } = await put(filename, file, {
      //     access: "public",
      //   });

      //   const blurhash = key === "image" ? await getBlurDataURL(url) : null;

      //   response = await prisma.site.update({
      //     where: {
      //       id: site.id,
      //     },
      //     data: {
      //       [key]: url,
      //       ...(blurhash && { imageBlurhash: blurhash }),
      //     },
      //   });
      } else {
        response = await prisma.site.update({
          where: {
            id: site.id,
          },
          data: {
            [key!]: value,
          },
        });
      }
      console.log(
        "Updated site data! Revalidating tags: ",
        `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
        `${site.customDomain}-metadata`,
      );
      revalidateTag(
        `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
      );
      site.customDomain &&
        (revalidateTag(`${site.customDomain}-metadata`));

      return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === "P2002") {
        return {
          error: `This ${key} is already taken`,
        };
      } else {
        return {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          error: error.message,
        };
      }
    }
  },
);

export const deleteSite = withSiteAuth(async (_formData, site: Site, _key): Promise<{ error?: string | undefined; }> => {
  try {
    const response = await prisma.site.delete({
      where: {
        id: site.id,
      },
    });
    revalidateTag(
      `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
    );
    response.customDomain &&
      (revalidateTag(`${site.customDomain}-metadata`));
    return {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      error: (error?.message ?? ''),
    };
  }
});

export const editUser = async (
  formData: FormData,
  _id: unknown,
  key: string,
) => {
  const session = await getServerAuthSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }
  const value = formData.get(key) as string;

  try {
    const response = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        [key]: value,
      },
    });
    return response;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (error.code === "P2002") {
      return {
        error: `This ${key} is already in use`,
      };
    } else {
      return {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        error: error.message,
      };
    }
  }
};

export const updateUser = async (
  formData: UserFormData
) => {
  const session = await getServerAuthSession();
  if (!session?.user.id) {
    throw new Error("Not authenticated");
  }

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: formData,
  });
};
