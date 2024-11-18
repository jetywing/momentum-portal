import { AvatarHeader } from "./avatar-header";
import { CmdButton } from "./cmd-button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Separator } from "./ui/separator";
import { SidebarTrigger } from "./ui/sidebar";

export function Header({
  currentPage,
  breadcrumbs,
}: {
  currentPage: string;
  breadcrumbs: {
    title: string;
    url: string;
  }[];
}) {
  return (
    <header className="mb-4">
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs?.map((breadcrumb) => (
                <>
                  <BreadcrumbItem
                    key={breadcrumb.title}
                    className="hidden md:block"
                  >
                    <BreadcrumbLink href={breadcrumb.url}>
                      {breadcrumb.title}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              ))}
              <BreadcrumbItem>
                <BreadcrumbPage>{currentPage}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center space-x-2 px-2">
          <CmdButton />
          <AvatarHeader />
        </div>
      </div>
      <Separator />
    </header>
  );
}
