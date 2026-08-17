import SitePage from "../../../site-page";
import { getMetadata } from "../../../page-data";

export const metadata = getMetadata("en", "products");
export default function Page() { return <SitePage language="en" page="products" />; }
