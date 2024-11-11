import { ICoupon } from "@/pages/Admin/AdminCouponManagementPage";
import React, { useState } from "react";
import ReactModal from "react-modal";
import { toast } from "sonner";
interface ICouponModalProps {
  isModalOpen: boolean; // To indicate if the modal is open
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleCouponData: (couponData: ICoupon) => void; // Function to update modal status
}
ReactModal.setAppElement("#root"); // Ensure modal accessibility

const CouponModal = ({
  isModalOpen,
  setIsModalOpen,
  handleCouponData,
}: ICouponModalProps) => {
  const [couponName, setCouponName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [maxDiscountPrice, setMaxDiscountPrice] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState<number | string>(
    ""
  );
  const [minimumPurchasePrice, setMinimumPurchasePrice] = useState<
    number | string
  >("");
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSendCouponAndCloseModal = () => {
    if (!couponName) {
      toast.error("Coupon name is required.");
      return;
    }
    if (!expiryDate) {
      toast.error("Expiry date is required.");
      return;
    }

    // Check if expiry date is greater than current date
    const currentDate = new Date();
    const selectedExpiryDate = new Date(expiryDate);
    if (selectedExpiryDate <= currentDate) {
      toast.error("Expiry date should be greater than the current date.");
      return;
    }

    if (!maxDiscountPrice || Number(maxDiscountPrice) <= 0) {
      toast.error("Max discount price must be a positive value.");
      return;
    }
    if (
      !discountPercentage ||
      Number(discountPercentage) <= 0 ||
      Number(discountPercentage) >= 100
    ) {
      toast.error("Discount percentage should be between 0 and 100.");
      return;
    }
    if (!minimumPurchasePrice || Number(minimumPurchasePrice) <= 0) {
      toast.error("Minimum purchase price must be a positive value.");
      return;
    }
    const DataToSend = {
      couponName,
      expiryDate,
      maxDiscountPrice,
      discountPercentage,
      minimumPurchasePrice,
    };

    handleCouponData(DataToSend);

    setCouponName("");
    setExpiryDate("");
    setMaxDiscountPrice("");
    setDiscountPercentage("");
    setMinimumPurchasePrice("");
  };

  return (
    <ReactModal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      contentLabel="Create New Coupon"
      style={{
        content: {
          width: "500px",
          height: "auto", // Allow content to determine height
          maxHeight: "78vh", // Set a max height (80% of viewport height)
          margin: "auto",
          borderRadius: "10px",
          color: "black",
          overflow: "auto", // Enable scrolling if content exceeds max height
        },
      }}
    >
      <h3 className="text-xl font-semibold mb-4">Create a New Coupon</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendCouponAndCloseModal();
        }}
      >
        <div className="mb-4">
          <label className="block text-gray-700">Coupon Code</label>
          <input
            type="text"
            className="mt-1 p-2 border border-gray-300 rounded w-full"
            value={couponName}
            onChange={(e) => setCouponName(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Discount Percentage</label>
          <input
            type="number"
            className="mt-1 p-2 border border-gray-300 rounded w-full"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Max Discount Price</label>
          <input
            type="number"
            className="mt-1 p-2 border border-gray-300 rounded w-full"
            value={maxDiscountPrice}
            onChange={(e) => setMaxDiscountPrice(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Minimum Purchase Price</label>
          <input
            type="number"
            className="mt-1 p-2 border border-gray-300 rounded w-full"
            value={minimumPurchasePrice}
            onChange={(e) => setMinimumPurchasePrice(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Expiry Date</label>
          <input
            type="date"
            className="mt-1 p-2 border border-gray-300 rounded w-full"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 mr-2"
          >
            Add Coupon
          </button>
          <button
            type="button"
            onClick={closeModal}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          >
            Close
          </button>
        </div>
      </form>
    </ReactModal>
  );
};

export default CouponModal;
