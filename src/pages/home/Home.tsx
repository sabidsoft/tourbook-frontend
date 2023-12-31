import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ToursCard from "../../components/cards/toursCard/ToursCard";
import ErrorMessage from "../../components/common/errorMessage/ErrorMessage";
import Loader from "../../components/common/loader/Loader";
import { useGetToursQuery } from "../../redux/features/api/tourApi/tourApi";
import SearchBar from "../../components/common/searchBar/SearchBar";
import Pagination from "../../components/common/pagination/Pagination";
import useTitle from "../../hooks/useTitle";

export default function Home() {
    useTitle("Home");
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const { data, isLoading, isError } = useGetToursQuery(currentPage);

    const tours = data?.data.tours;

    const pagination = data?.data.pagination;
    const totalPage = pagination?.totalPage || 1;

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Handle title change
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    // handle submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (searchText) {
            navigate(`/tours/search?search_query=${searchText}`);
        }
    };

    let content;

    if (isLoading)
        content = <Loader />;

    if (!isLoading && isError)
        content = <ErrorMessage message="Something went wrong." />;

    if (!isLoading && !isError && tours && tours.length === 0)
        content = <ErrorMessage message='Opps! Sorry! There is no tour available.' />;

    if (!isLoading && !isError && tours && tours.length > 0)
        content =
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-8 mx-5 md:mx-0">
                    {
                        tours && tours
                            .map(tour => <ToursCard key={tour._id} tour={tour} />)
                    }
                </div>
                {
                    totalPage > 1 &&
                    <div className="py-8 mt-8 text-center">
                        <Pagination
                            totalPage={totalPage}
                            currentPage={currentPage}
                            handlePageChange={handlePageChange}
                        />
                    </div>
                }
            </>;

    return (
        <div className="w-full md:w-[80%] 2xl:w-[70%] mx-auto py-8">
            <div className="pb-8">
                <SearchBar
                    searchText={searchText}
                    handleSubmit={handleSubmit}
                    handleTitleChange={handleTitleChange}
                />
            </div>
            {content}
        </div>
    );
};