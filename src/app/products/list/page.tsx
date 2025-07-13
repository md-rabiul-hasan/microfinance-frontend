
// Import required dependencies
import { getProductList } from "@actions/product-config"; // API call to fetch product list
import ProductListUi from "./ui"; // UI component to display the product list

// Define the search parameters type
type SearchParams = {
  page?: number;
  per_page?: number;
  search?: string;
};

// Define props for the component
type Props = {
  searchParams: Promise<SearchParams>; // Asynchronous search parameters
};

/**
 * ProductListPage Component
 * Fetches and displays the paginated product list based on search parameters.
 * 
 * @param {Props} props - Component props containing search parameters.
 * @returns {JSX.Element} - The UI component displaying the product list.
 */
const ProductListPage = async ({ searchParams }: Props) => {
  // Await the resolved search parameters before using them
  const params = await searchParams;

  // Destructure with default values to prevent undefined issues
  const { per_page = 10, page = 1, search = "" } = params;

  // Fetch the product list from the API
  const res = await getProductList({ page, per_page, search });

  // Render the UI component with fetched data
  return <ProductListUi data={res} />;
};

export default ProductListPage;
