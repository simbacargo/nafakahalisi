import SitePage from "../../site-page";
import { getMetadata } from "../../page-data";

export const metadata = getMetadata("sw", "products");
export default function Page() { return <SitePage language="sw" page="products" />; }
