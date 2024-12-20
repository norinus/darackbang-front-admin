import { Chart } from 'react-google-charts';
import {useEffect, useState} from 'react';

import { getProductQuarterStat} from "../../api/statisticApi";
import useCustomHook from "../hooks/useCustomHook";

const ProductQuarterComponent = () => {

    const {exceptionHandler} = useCustomHook()


    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = new Date().getMonth() + 1; // Months are zero-indexed
    const currentQuarter = Math.floor((currentMonth - 1) / 3) + 1;

    const [year, setYear] = useState(currentYear); // Default year
    const [quarter, setQuarter] = useState(currentQuarter);
    const [data, setData] = useState([]);
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    useEffect(() => {
        getProductQuarterStat(year,quarter).then(data => {
            setData(data);
        }).catch(error => {
            exceptionHandler(error)
        });
    }, [year,quarter]);


    const chartData = [
        ['상품명', '총구매액'],
        ...data.map(item => [item.productName, parseFloat(item.totalAmount)]),
    ];



    const options = {
        title: `상품별 총 구매 금액 (${year}년 ${quarter})`,
        hAxis: { title: '상품' },
        vAxis: { title: '총 구매액' },
        legend: 'none',
    };

    return (
        <div className="p-3 bg-white rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">상품별 분기 구매 통계</h2>

            <div className="flex justify-end mb-4 space-x-4">
                <div className="w-1/2">
                    <label htmlFor="year-select" className="block mb-1 font-medium">년도</label>
                    <select
                        id="year-select"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    >
                        {[...Array(currentYear - 2024 + 1)].map((_, index) => {
                            const optionYear = 2024 + index;
                            return (
                                <option key={optionYear} value={optionYear}>
                                    {optionYear}
                                </option>
                            );
                        })}
                    </select>
                </div>

                <div className="w-1/2">
                    <label htmlFor="quarter-select" className="block mb-1 font-medium">분기</label>
                    <select
                        id="quarter-select"
                        value={quarter}
                        onChange={(e) => setQuarter(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    >
                        {/* Generate quarters only up to the current year and quarter */}
                        {[...Array(year === currentYear ? currentQuarter : 4)].map((_, index) => (
                            <option key={index + 1} value={index + 1}>
                                {index + 1}분기
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {data.length > 0 ? (
                <Chart
                    chartType="ColumnChart"
                    data={chartData}
                    options={options}
                    width="100%"
                    height="400px"
                    loader={<div>Loading Chart...</div>}
                />
            ) : (
                <div className="text-center mt-4">데이터가 없습니다.</div>
            )}
        </div>
    );
};

export default ProductQuarterComponent;
