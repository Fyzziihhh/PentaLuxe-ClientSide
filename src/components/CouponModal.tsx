import { ICoupon } from '@/pages/Admin/AdminCouponManagementPage';
import React, { useState } from 'react';
import ReactModal from 'react-modal';
interface ICouponModalProps  {
    isModalOpen: boolean;  // To indicate if the modal is open
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handleCouponData:(couponData:ICoupon)=>void  // Function to update modal status
  };
ReactModal.setAppElement('#root'); // Ensure modal accessibility

const CouponModal = ({isModalOpen,setIsModalOpen,handleCouponData}:ICouponModalProps) => {

  const [couponName, setCouponName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [maxDiscountPrice,setMaxDiscountPrice] = useState('');
  const [discountPercentage,setDiscountPercentage]=useState<number |string >('')
const [minimumPurchasePrice,setMinimumPurchasePrice]=useState<number | string>('')
  const closeModal=()=>{
    setIsModalOpen(false)
  }

  const handleSendCouponAndCloseModal = () => {
    const DataToSend = {
        couponName,
        expiryDate,
        maxDiscountPrice,
        discountPercentage,
         minimumPurchasePrice,
    };

    handleCouponData(DataToSend);

    setCouponName('');
    setExpiryDate('');
    setMaxDiscountPrice('');
    setDiscountPercentage('');
    setMinimumPurchasePrice('');

    closeModal();
};


  return (
      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Create New Coupon"
        style={{
            content: {
              width: '500px',
              height: 'auto', // Allow content to determine height
              maxHeight: '78vh', // Set a max height (80% of viewport height)
              margin: 'auto',
              borderRadius: '10px',
              color: 'black',
              overflow: 'auto', // Enable scrolling if content exceeds max height
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
              required
            />
          </div>
        
          <div className="mb-4">
            <label className="block text-gray-700">Discount Percentage</label>
            <input
              type="number"
              className="mt-1 p-2 border border-gray-300 rounded w-full"
              value={discountPercentage}
              onChange={(e) => setDiscountPercentage(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Max Discount Price</label>
            <input
              type="number"
              className="mt-1 p-2 border border-gray-300 rounded w-full"
              value={maxDiscountPrice}
              onChange={(e) => setMaxDiscountPrice(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Minimum Purchase Price</label>
            <input
              type="number"
              className="mt-1 p-2 border border-gray-300 rounded w-full"
              value={minimumPurchasePrice}
              onChange={(e) =>setMinimumPurchasePrice (e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Expiry Date</label>
            <input
              type="date"
              className="mt-1 p-2 border border-gray-300 rounded w-full"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              required
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