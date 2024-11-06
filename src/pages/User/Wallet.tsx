import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/apiService";
import { AppHttpStatusCodes } from "../../types/statusCode";
import { Wallet, ArrowDownCircle, DollarSign } from "lucide-react";
import { IOrder } from "@/types/orderTypes";

interface ITransactions{
  orderID:string,
  type:string;
  date:string;
  method:string;
  amount:number;
}

const WalletPage = () => {
  const [balance, setBalance] = useState(0);
  const [transactions,setTransactions]=useState<ITransactions[]>([])
  const [loading, setLoading] = useState(false);

  // Fetch wallet balance and transactions
  const fetchWalletData = async () => {

    setLoading(true);
    const res=await api.get('/api/user/wallet')
    if(res.status===AppHttpStatusCodes.OK){
      const data=res.data.data
      console.log(data)
         setTransactions(data.transactions)
         setBalance(data.balance)
    }
    // Fetch data logic (not implemented here)
    setLoading(false); // Make sure to set loading to false after fetching
  };

  useEffect(() => {
    fetchWalletData();
  }, []); // Call the function when the component mounts



  return (
    <div className="container mx-auto p-6 bg-gray-900 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-white text-center">
        <Wallet className="inline mr-2" /> My Wallet
      </h1>
      <div className="mt-6">
        <h2 className="text-xl text-gray-300">
          <DollarSign className="inline mr-1" />
          Balance: {balance||0}
        </h2>
      </div>

      <h3 className="text-2xl text-white mt-8">Transaction History</h3>
      <div className="bg-gray-800 rounded-lg mt-4 p-4">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-gray-300 py-2">Date</th>
              <th className="text-gray-300 py-2">Type</th>
              <th className="text-gray-300 py-2">Method</th>
              <th className="text-gray-300 py-2">Order ID</th>
              <th className="text-gray-300 py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions?.length > 0 ? (
              transactions.map((transaction, index) => (
                <tr key={index} className={`border-b border-gray-700`}>
                  <td className="text-gray-400 py-2">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td
                    className={`py-2 font-bold ${
                      transaction.type === "debit"
                        ? "text-red-400"
                        : "text-green-400"
                    }`}
                  >
                    {transaction.type.charAt(0).toUpperCase() +
                      transaction.type.slice(1)}
                  </td>
                  <td className="text-gray-400 py-2">{transaction.method}</td>
                  <td className="text-gray-400 py-2">{transaction.orderID}</td>
                  <td className="text-gray-400 py-2">₹{transaction.amount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-gray-400 text-center py-2">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WalletPage;
