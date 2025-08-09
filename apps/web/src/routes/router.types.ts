import { RouteObject } from 'react-router-dom';

export type NoitaRouteObject = RouteObject & {
  /**
   * If true, this page will be pre-rendered
   */
  ssg?: boolean;
  /**
   * If true, this page will show up in the sitemap
   */
  sitemap?: boolean;
  /**
   * Provide the url dynamic parameters for the path here
   */
  getAllDynamicParams?: () => string[];
  children?: NoitaRouteObject[];
};
