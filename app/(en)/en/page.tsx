import SitePage from "../../site-page";
import { getMetadata } from "../../page-data";

export const metadata = getMetadata("en", "home");
export default function Page() { return <SitePage language="en" page="home" />; }
