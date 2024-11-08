import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import successImage from '../../assets/images/white-curve.png';
import { confirmPayments, approvePayments } from '../../api/payment';
import { updatePoint } from '../../api/purchase';

export default function SuccessPage() {
  const userData = sessionStorage.getItem('userData');
  const parsedData = userData ? JSON.parse(userData) : null;
  const [id, setId] = useState(parsedData.id);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 쿼리 파라미터 값이 결제 요청할 때 보낸 데이터와 동일한지 반드시 확인하세요.
  // 클라이언트에서 결제 금액을 조작하는 행위를 방지할 수 있습니다.
  const requestData = {
    orderId: searchParams.get('orderId'),
    amount: searchParams.get('amount'),
    paymentKey: searchParams.get('paymentKey'),
  };

  async function confirm() {
    try {
      const response = await confirmPayments(requestData);

      if (response.status !== 200) {
        navigate(`/fail?message=${response.data.message}&code=${response.data.code}`);
        return;
      }

      approve();
    } catch (error) {
      if (error.response) {
        navigate(`/fail?message=${error.response.data.message}&code=${error.response.data.code}`);
      } else {
        console.error('Request error:', error);
      }
    }
  }

  async function approve() {
    //결제 성공 로직 - 포인트 추가 & add to payment-approved table
    try {
      const userId = id;
      const orderId = requestData.orderId;
      const amount = requestData.amount;
      const paymentKey = requestData.paymentKey;

      const response = await updatePoint(userId, amount);

      console.log('Updated points successfully:', response);

      await approvePayments(orderId, amount, paymentKey);
    } catch (error) {
      if (error.response) {
        console.error('Error updating points:', error.response.data.message || error.message);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error in setup:', error.message);
      }
    }
  }

  useEffect(() => {
    confirm();
  }, []);

  return (
    <div className="flex flex-col justify-start items-center text-center h-full w-full bg-white pt-12">
      <img src={successImage} alt="회원가입 성공" className="w-[300px] h-[300px] mb-3" />
      <h2 className="text-lg font-bold text-gray-800">결제 완료</h2>
      <div className="flex flex-col items-center">
        <button onClick={() => navigate(`/mypage`)} className="mt-6 py-2 px-4 bg-primary text-white rounded-lg focus:outline-none">
          <span className="font-bold">마이페이지</span>
          <span className="text-sm">로 돌아가기</span>
        </button>
        <button onClick={() => navigate(`/shoppingcart`)} className="mt-3 py-2 px-4 bg-primary text-white rounded-lg focus:outline-none">
          <span className="font-bold">장바구니</span>
          <span className="text-sm">로 돌아가기</span>
        </button>
      </div>
    </div>
  );
}
