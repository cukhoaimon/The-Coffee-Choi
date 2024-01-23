import { useState } from "react";

import CustomDialog from "../common/Dialog";

import ProductCard from "../ProductCard/ProductCard";

export default function MenuContent({ categories, products }) {
  const [searchValue, setSearchValue] = useState("");
  const [openFilter, setOpenFilter] = useState(false);

  return (
    <div className=" mx-4 mt-16 lg:w-full lg:mt-0 lg:border-l-2 lg:border-solid lg:border-amber-800 lg:pl-16">
      <form className="relative" onSubmit={(e) => e.preventDefault()}>
        <input
          type="search"
          id="default-search"
          className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-amber-500 dark:focus:border-amber-500"
          placeholder="Tên sản phẩm"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
          required
        />

        <button
          type="submit"
          className="text-white absolute end-2.5 bottom-1 bg-amber-700 hover:bg-amber-800 focus:ring-4 focus:outline-none focus:ring-amber-300 font-medium rounded-lg text-sm px-2 py-1 dark:bg-amber-600 dark:hover:bg-amber-700 dark:focus:ring-amber-800">
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </form>

      <div className=" mt-4 mb-8 ">
        <button
          className=" py-1 px-2 rounded border-2 border-solid text-sm border-gray-200"
          onClick={() => setOpenFilter(true)}>
          <i className="fa-solid fa-filter mr-2"></i>
          Bộ lọc
        </button>

        <CustomDialog
          title={"Bộ lọc"}
          onClose={() => setOpenFilter(false)}
          open={openFilter}>
          <div>123</div>
        </CustomDialog>
      </div>

      {categories.map((category) => (
        <div key={category.id}>
          <div className=" mb-4 font-semibold text-2xl">{category.name}</div>

          <div className=" mb-12 grid grid-cols-2 gap-x-8 md:grid-cols-4 md:gap-x-4 lg:grid-cols-4 lg:gap-x-4">
            {searchValue === ""
              ? products
                  .filter((product) => product.category === category.id)
                  .map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
              : products
                  .filter((product) => product.category === category.id)
                  .filter((product) =>
                    product.name
                      .toLowerCase()
                      .includes(searchValue.toLowerCase())
                  )
                  .map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
          </div>
        </div>
      ))}
    </div>
  );
}
