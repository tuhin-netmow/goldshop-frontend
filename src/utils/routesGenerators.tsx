

import { Suspense } from "react";
import { Navigate, type RouteObject } from "react-router";
import { Loader2 } from "lucide-react";
import type { TUserPath } from "../types/sidebar.types";
import { PermissionsGurd } from "@/routes/PermissionsGurd";


// Dummy fallback page
// eslint-disable-next-line react-refresh/only-export-components
const DummyPage = ({ title }: { title: string }) => (
  <div className="p-8 text-xl font-bold">{title} Page</div>
);

export const generateRoutes = (items: TUserPath[], parentPath = ""): RouteObject[] => {
  const routes: RouteObject[] = [];

  items.forEach((item) => {
    if (!item.url || item.url === "#") {
      if (item.items && item.items.length > 0) {
        routes.push(...generateRoutes(item.items, parentPath));
      }
      return;
    }

    // Convert absolute path to relative path if parentPath exists
    let relativePath = item.url;
    if (parentPath && relativePath.startsWith("/")) {
      relativePath = relativePath.replace(/^\/?/, "");
      if (relativePath.startsWith(parentPath + "/")) {
        relativePath = relativePath.replace(parentPath + "/", "");
      }
    }

    const wrapWithPermissionAndSuspense = (element: React.ReactNode) => {
      const content = (
        <Suspense fallback={
          <div className="flex items-center justify-center h-[500px]">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        }>
          {element}
        </Suspense>
      );

      if (item.allowedPermissions && item.allowedPermissions.length > 0) {
        return (
          <PermissionsGurd allowedPermissions={item.allowedPermissions}>
            {content}
          </PermissionsGurd>
        );
      }
      return content;
    };

    if (item.items && item.items.length > 0 && item.layout) {
      routes.push({
        path: relativePath + "/*",
        element: wrapWithPermissionAndSuspense(item.layout),
        children: [
          {
            index: true,
            element: <Navigate to={item.items[0].url.split("/").pop() || ""} replace />,
          },
          ...item.items.map((child) => ({
            path: child.url.split("/").pop(),
            element: wrapWithPermissionAndSuspense(child.element || <DummyPage title={child.title} />),
          })),
        ],
      });
      return;
    }

    // Add route
    routes.push({
      path: relativePath,
      element: wrapWithPermissionAndSuspense(item.element || <DummyPage title={item.title} />),
    });

    if (item.items && item.items.length > 0) {
      routes.push(...generateRoutes(item.items, relativePath));
    }
  });

  return routes;
};


















// import { Navigate, type RouteObject } from "react-router";
// import type { TUserPath } from "../types/sidebar.types";

// // Dummy fallback page
// // eslint-disable-next-line react-refresh/only-export-components
// const DummyPage = ({ title }: { title: string }) => (
//   <div className="p-8 text-xl font-bold">{title} Page</div>
// );


// export const generateRoutes = (items: TUserPath[], parentPath = ""): RouteObject[] => {
//   const routes: RouteObject[] = [];

//   items.forEach((item) => {
//     // Skip placeholders
//     if (!item.url || item.url === "#") {
//       // Only process children if they exist
//       if (item.items && item.items.length > 0) {
//         routes.push(...generateRoutes(item.items, parentPath));
//       }
//       return;
//     }

//     // Convert absolute path to relative path if parentPath exists
//     let relativePath = item.url;
//     if (parentPath && relativePath.startsWith("/")) {
//       relativePath = relativePath.replace(/^\/?/, ""); // remove leading slash
//       if (relativePath.startsWith(parentPath + "/")) {
//         relativePath = relativePath.replace(parentPath + "/", "");
//       }
//     }



    


//     if (item.items && item.items.length > 0 && item.layout) {
//       // Use layout for nested children
//       routes.push({
//         path: relativePath + "/*",
//         element: item.layout,
//         children: [
//           {
//             index: true, element: (
//               <Navigate
//                 to={item.items[0].url.split("/").pop() || ""}
//                 replace
//               />
//             ),
//           },
//           ...item.items.map((child) => ({
//             path: child.url.split("/").pop(),
//             element: child.element || <DummyPage title={child.title} />,
//           })),
//         ],
//       });
//       return; // Skip normal route push since handled here
//     }


//     // Add route
//     routes.push({
//       path: relativePath,
//       element: item.element || <DummyPage title={item.title} />,
//     });

//     // Process children recursively
//     if (item.items && item.items.length > 0) {
//       routes.push(...generateRoutes(item.items, relativePath));
//     }
//   });

//   return routes;
// };
