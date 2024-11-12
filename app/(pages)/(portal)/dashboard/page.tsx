'use client'
import OfferList from "@/components/offer-jobs/offer-list";
import Pagination from "@/components/offer-jobs/offer-pagination";
import OfferSearch from "@/components/offer-jobs/offer-search";
import { Button } from "@/components/ui/button";
import { IOffer } from "@/lib/interfaces/offer";
import { mapIOfferToTypeOffer } from "@/lib/utils";
import { Offer } from "@/types/offer";
import { use, useEffect, useState } from "react";

type SearchData = {
    keyword: string;
    provincia: string;
    localidad: string;
}

export default function DashboardPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const offersPerPage = 5;
    const [totalOffers, setTotalOffers] = useState(0);
    const totalPages = Math.ceil(totalOffers / offersPerPage);


    const [offers, setOffers] = useState<Offer[]>([]);
    const [search, setSearch] = useState<SearchData>({keyword: '', provincia: '', localidad: ''});
    
    const handleOfferSearch = (searchData: SearchData) => {
        console.log(searchData);
        setSearch(searchData);
    }

    const fetchOffers = async () => {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/offer?search=${JSON.stringify(search)}&page=${currentPage}&limit=${offersPerPage}`);
          const data = await response.json();
          const offers: IOffer[] = data.offers;
          const mappedOffers = mapIOfferToTypeOffer(offers);
          setOffers(mappedOffers);
          setTotalOffers(data.totalOffers);
    }

    useEffect(() => {
        fetchOffers();
    }, [search, currentPage]);


    return (
        <div>
            
            <OfferSearch
                onSearch={handleOfferSearch}
            />
            <OfferList
                offers={offers}
            />
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
            />
        </div>
    );
}