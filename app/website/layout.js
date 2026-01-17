// components
import NavCommerce from "./componets/navCommerce";
export default function layputcommerce({ children }) {
  return (
    <div>
      <NavCommerce />
      <>{children}</>
    </div>
  );
}
