import CouponModal from "@/components/CouponModal";
import Pagination from "@/components/Pagination";

import api from "@/services/apiService";
import { AppHttpStatusCodes } from "@/types/statusCode";
// import { AppHttpStatusCodes } from '@/types/statusCode';

import { AxiosError } from "axios";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export interface ICoupon {
  _id?: string;
  couponName: string;
  expiryDate: string;
  maxDiscountPrice: string;
  discountPercentage: number | string;
  minimumPurchasePrice: number | string;
}

const CouponManagement: React.FC = () => {
  const [modalStatus, setModalStatus] = useState(false);
  const [coupons, setCoupons] = useState<ICoupon[]>([]);
  const [displayCoupons, setDispalyCoupons] = useState<ICoupon[]>([]);


  // Function to remove a coupon
  const removeCoupon = async (id: string) => {
    try {
      const res = await api.delete(`/api/admin/coupon/${id}`);
      if (res.status === AppHttpStatusCodes.OK) {
        toast.success(res.data.message);
        setCoupons(
          coupons.filter((coupon) => coupon._id && coupon._id.toString() !== id)
        );
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || "Hell kjalksdjklfjlsj");
      }
    }
  };


  const CreateCouponEntry = async (couponData: ICoupon) => {
    try {
      const {
        data: { data: coupon },
      } = await api.post("/api/admin/coupon", { couponData });
      setModalStatus(false)
      if (coupon) {
        setCoupons((prev) => [...prev, coupon]);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
    }
  };

  const getAllCoupons = async () => {
    const res = await api.get("/api/admin/coupon");
    if (res.status === AppHttpStatusCodes.OK) {
      setCoupons(res.data.data);
      console.log(res.data.data);
    }
  };

  const handlePagination = (items: ICoupon[]) => {
    setDispalyCoupons(items);
  };

  useEffect(() => {
    getAllCoupons();
  }, []);
  return (
    <div className="p-8 text-black h-screen">
      <h2 className="text-4xl font-semibold mb-6">Coupon Management</h2>

      <button
        onClick={() => setModalStatus(true)}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Create New Coupon
      </button>
      <CouponModal
        isModalOpen={modalStatus}
        setIsModalOpen={setModalStatus}
        handleCouponData={CreateCouponEntry}
      />

      <div className="h-[80%] overflow-x-auto mt-5 border border-gray-300 rounded-lg shadow-lg">
        <table className="min-w-full bg-white text-center">
          <thead className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
            <tr>
              <th className="px-6 py-3 font-semibold">Coupon Name</th>
              <th className="px-6 py-3 font-semibold">Discount Percentage</th>
              <th className="px-6 py-3 font-semibold">Max Discount Price</th>
              <th className="px-6 py-3 font-semibold">
                Minimum Purchase Price
              </th>
              <th className="px-6 py-3 font-semibold">Expiry Date</th>
              <th className="px-6 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.length > 0 ? (
              (displayCoupons.length>0?displayCoupons:coupons).map((coupon, index) => (
                <tr
                  key={coupon._id}
                  className={`border-b ${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } transition duration-300 ease-in-out hover:bg-gray-200`}
                >
                  <td className="px-6 py-4 text-gray-800 font-medium">
                    {coupon.couponName}
                  </td>
                  <td className="px-6 py-4 text-teal-600">
                    {coupon.discountPercentage}%
                  </td>
                  <td className="px-6 py-4 text-green-600">
                  ₹{coupon.maxDiscountPrice}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                  ₹{coupon.minimumPurchasePrice}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {coupon.expiryDate ? (
                      new Date(coupon.expiryDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    ) : (
                      <span className="text-red-500">Coupon Exipired</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      className="flex items-center bg-gradient-to-r from-red-500 to-pink-500 text-white py-2 px-4 rounded-full shadow-lg hover:shadow-2xl transition duration-200 transform hover:scale-105"
                      onClick={() => removeCoupon(coupon._id ?? "")}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1H9a1 1 0 00-1 1v3m7 0H8"
                        />
                      </svg>
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No Coupons Available
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination items={coupons} itemsPerPage={5} onPageChange={handlePagination}/>
      </div>
    </div>
  );
};

export default CouponManagement;
