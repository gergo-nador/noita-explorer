import { RouteObject } from 'react-router-dom';

export type NoitaRouteObject = RouteObject & {
  /**
   * If false, no SSG will be generated. By default, it is true.
   */
  ssg?: boolean;
  /**
   * If false, this route will be ignored for sitemaps. By default it is true.
   */
  sitemap?: boolean;
  /**
   * Provide the url dynamic parameters for the path here
   */
  getAllDynamicParams?: () => string[];
  children?: NoitaRouteObject[];
};
