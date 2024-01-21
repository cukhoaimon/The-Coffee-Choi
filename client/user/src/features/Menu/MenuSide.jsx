import { useState } from "react";

export default function MenuSide({
  category,
  selectedCategory,
  onClickCategory,
}) {
  // const [selectedCategory, setSelectedCategory] = useState(category);

  return (
    <div className=" lg:w-1/4">
      <div className="w-full px-4 fixed top-[70px] bg-white flex justify-center shadow-xl lg:hidden">
        <select
          name=""
          id=""
          onChange={(e) => onClickCategory(e.target.value)}
          className=" w-full my-2 border-2 border-solid border-amber-800 rounded-lg px-4 py-1">
          <option value="All">Tất cả</option>
          {category.map((item, index) => (
            <option key={index} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      <div className=" hidden lg:block leading-loose">
        <div
          onClick={() => onClickCategory("All")}
          className=" cursor-pointer flex relative">
          {selectedCategory?.length > 1 && (
            <img
              className=" absolute -left-5 top-1/2 transform -translate-y-1/2"
              src="data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6.50845 14.6668C6.77905 14.6668 7.05631 14.6495 7.33891 14.6135C9.07581 14.3962 10.7847 13.5229 12.1537 12.1537C13.5227 10.7845 14.3972 9.07401 14.6144 7.33816C14.8384 5.53966 14.3385 3.92514 13.2055 2.79324C12.0737 1.66135 10.4675 1.16272 8.66125 1.38537C6.92435 1.60268 5.21544 2.47594 3.84644 3.84515C2.47745 5.21436 1.603 6.92487 1.38572 8.66071C1.16177 10.4592 1.66165 12.0737 2.7947 13.2056C3.74913 14.1629 5.04615 14.6668 6.50845 14.6668ZM9.48505 2.66792C10.5941 2.66792 11.5645 3.03722 12.263 3.73716C13.0988 4.57175 13.4627 5.79297 13.2908 7.17418C13.1108 8.61805 12.3737 10.0526 11.2113 11.2125C10.0489 12.3724 8.61726 13.111 7.17362 13.2923C5.79396 13.4656 4.5716 13.1003 3.73714 12.2644C2.90134 11.4298 2.53743 10.2086 2.70939 8.82736C2.88935 7.38349 3.6265 5.94896 4.78888 4.78906C5.95125 3.62917 7.3829 2.89057 8.82654 2.70925C9.05049 2.68125 9.27043 2.66792 9.48505 2.66792Z' fill='%23E57905'%3E%3C/path%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M7.33875 14.6135C7.05615 14.6495 6.77889 14.6668 6.50829 14.6668C5.04598 14.6668 3.74897 14.1629 2.79454 13.2056C1.66149 12.0737 1.16161 10.4592 1.38556 8.66071C1.60284 6.92487 2.47729 5.21436 3.84628 3.84515C5.21527 2.47594 6.92418 1.60268 8.66109 1.38537C10.4673 1.16272 12.0736 1.66135 13.2053 2.79324C14.3383 3.92514 14.8382 5.53966 14.6143 7.33816C14.397 9.07401 13.5225 10.7845 12.1536 12.1537C10.7846 13.5229 9.07565 14.3962 7.33875 14.6135ZM11.6664 3.25969C11.0513 2.87041 10.3061 2.66792 9.48488 2.66792C9.27027 2.66792 9.05032 2.68125 8.82638 2.70925C7.38274 2.89057 5.95109 3.62917 4.78871 4.78906C3.62634 5.94896 2.88918 7.38349 2.70923 8.82736C2.53727 10.2086 2.90118 11.4298 3.73697 12.2644C3.77282 12.3003 3.80939 12.3353 3.84665 12.3695C3.84429 12.2999 3.84304 12.2194 3.84369 12.125C3.84416 12.0574 3.84419 11.9893 3.84421 11.9207C3.84454 10.9801 3.8449 9.93499 4.99994 8.66683C6.23742 7.30627 7.14124 6.97155 8.19009 6.80422C8.24623 6.79537 8.30287 6.78663 8.35992 6.77782C9.25643 6.63944 10.2537 6.48549 10.9999 5.66683C11.6879 4.91212 11.6791 4.27675 11.6689 3.5404C11.6677 3.44855 11.6664 3.35511 11.6664 3.25969ZM13.0971 5.07357C13.3173 5.69983 13.3854 6.41269 13.2906 7.17418C13.1107 8.61805 12.3735 10.0526 11.2111 11.2125C10.0487 12.3724 8.6171 13.111 7.17346 13.2923C6.46543 13.3812 5.79882 13.3283 5.20481 13.1428C5.21595 12.9644 5.21283 12.7728 5.20934 12.5598C5.20713 12.4243 5.20477 12.28 5.20585 12.125L5.20586 12.1234C5.21199 11.2354 5.21684 10.5321 6.00993 9.66016C6.80363 8.7894 7.39302 8.48153 8.33327 8.33349C8.46856 8.31191 8.61061 8.29279 8.75807 8.27295C9.75382 8.13894 10.9966 7.9717 12.0744 6.78663C12.6185 6.18843 12.9245 5.61399 13.0971 5.07357Z' fill='%23E57905'%3E%3C/path%3E%3C/svg%3E"
              alt=""
            />
          )}

          <p
            className={
              selectedCategory?.length > 1
                ? " text-amber-600 font-semibold"
                : " font-light"
            }>
            Tất cả
          </p>
        </div>
        {category.map((item) => (
          <div
            onClick={() => onClickCategory(item.id)}
            className=" cursor-pointer flex relative"
            key={item.id}>
            {selectedCategory?.length === 1 &&
              selectedCategory[0].id === item.id && (
                <img
                  className=" absolute -left-5 top-1/2 transform -translate-y-1/2"
                  src="data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6.50845 14.6668C6.77905 14.6668 7.05631 14.6495 7.33891 14.6135C9.07581 14.3962 10.7847 13.5229 12.1537 12.1537C13.5227 10.7845 14.3972 9.07401 14.6144 7.33816C14.8384 5.53966 14.3385 3.92514 13.2055 2.79324C12.0737 1.66135 10.4675 1.16272 8.66125 1.38537C6.92435 1.60268 5.21544 2.47594 3.84644 3.84515C2.47745 5.21436 1.603 6.92487 1.38572 8.66071C1.16177 10.4592 1.66165 12.0737 2.7947 13.2056C3.74913 14.1629 5.04615 14.6668 6.50845 14.6668ZM9.48505 2.66792C10.5941 2.66792 11.5645 3.03722 12.263 3.73716C13.0988 4.57175 13.4627 5.79297 13.2908 7.17418C13.1108 8.61805 12.3737 10.0526 11.2113 11.2125C10.0489 12.3724 8.61726 13.111 7.17362 13.2923C5.79396 13.4656 4.5716 13.1003 3.73714 12.2644C2.90134 11.4298 2.53743 10.2086 2.70939 8.82736C2.88935 7.38349 3.6265 5.94896 4.78888 4.78906C5.95125 3.62917 7.3829 2.89057 8.82654 2.70925C9.05049 2.68125 9.27043 2.66792 9.48505 2.66792Z' fill='%23E57905'%3E%3C/path%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M7.33875 14.6135C7.05615 14.6495 6.77889 14.6668 6.50829 14.6668C5.04598 14.6668 3.74897 14.1629 2.79454 13.2056C1.66149 12.0737 1.16161 10.4592 1.38556 8.66071C1.60284 6.92487 2.47729 5.21436 3.84628 3.84515C5.21527 2.47594 6.92418 1.60268 8.66109 1.38537C10.4673 1.16272 12.0736 1.66135 13.2053 2.79324C14.3383 3.92514 14.8382 5.53966 14.6143 7.33816C14.397 9.07401 13.5225 10.7845 12.1536 12.1537C10.7846 13.5229 9.07565 14.3962 7.33875 14.6135ZM11.6664 3.25969C11.0513 2.87041 10.3061 2.66792 9.48488 2.66792C9.27027 2.66792 9.05032 2.68125 8.82638 2.70925C7.38274 2.89057 5.95109 3.62917 4.78871 4.78906C3.62634 5.94896 2.88918 7.38349 2.70923 8.82736C2.53727 10.2086 2.90118 11.4298 3.73697 12.2644C3.77282 12.3003 3.80939 12.3353 3.84665 12.3695C3.84429 12.2999 3.84304 12.2194 3.84369 12.125C3.84416 12.0574 3.84419 11.9893 3.84421 11.9207C3.84454 10.9801 3.8449 9.93499 4.99994 8.66683C6.23742 7.30627 7.14124 6.97155 8.19009 6.80422C8.24623 6.79537 8.30287 6.78663 8.35992 6.77782C9.25643 6.63944 10.2537 6.48549 10.9999 5.66683C11.6879 4.91212 11.6791 4.27675 11.6689 3.5404C11.6677 3.44855 11.6664 3.35511 11.6664 3.25969ZM13.0971 5.07357C13.3173 5.69983 13.3854 6.41269 13.2906 7.17418C13.1107 8.61805 12.3735 10.0526 11.2111 11.2125C10.0487 12.3724 8.6171 13.111 7.17346 13.2923C6.46543 13.3812 5.79882 13.3283 5.20481 13.1428C5.21595 12.9644 5.21283 12.7728 5.20934 12.5598C5.20713 12.4243 5.20477 12.28 5.20585 12.125L5.20586 12.1234C5.21199 11.2354 5.21684 10.5321 6.00993 9.66016C6.80363 8.7894 7.39302 8.48153 8.33327 8.33349C8.46856 8.31191 8.61061 8.29279 8.75807 8.27295C9.75382 8.13894 10.9966 7.9717 12.0744 6.78663C12.6185 6.18843 12.9245 5.61399 13.0971 5.07357Z' fill='%23E57905'%3E%3C/path%3E%3C/svg%3E"
                  alt=""
                />
              )}
            <p
            className={
              selectedCategory?.length === 1 &&
              selectedCategory[0].id === item.id
                ? " text-amber-600 font-semibold"
                : " font-light"
            }>{item.name}</p>
            
          </div>
        ))}
      </div>
    </div>
  );
}
