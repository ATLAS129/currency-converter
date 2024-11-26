import { useEffect, useState } from "react";

const currencies = [
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "CHF",
  "UAH",
  "CAD",
  "AUD",
  "CNY",
  "INR",
];

type Currency = {
  currency: string;
  value: number | "";
};

export default function App() {
  const [firstCurrency, setFirstCurrency] = useState<Currency>({
    currency: "USD",
    value: 1,
  });
  const [secondCurrency, setSecondCurrency] = useState<Currency>({
    currency: "EUR",
    value: 1,
  });
  const [timeUpdated, setTimeUpdated] = useState<string>();

  async function fetchCurrency() {
    try {
      const response = await fetch(
        `https://open.er-api.com/v6/latest/${firstCurrency.currency}`
      );

      const result = await response.json();

      if (result && result.rates && result.rates[secondCurrency.currency]) {
        setSecondCurrency({
          ...secondCurrency,
          value: +(
            result.rates[secondCurrency.currency] * +firstCurrency.value
          ).toFixed(2),
        });

        setTimeUpdated(
          new Date(result.time_last_update_utc)
            .toString()
            .split(" ")
            .slice(0, 5)
            .join(" ")
        );
      }
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    fetchCurrency();
  }, [firstCurrency.currency, firstCurrency.value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (newValue === "") {
      setFirstCurrency({ ...firstCurrency, value: "" });
    } else {
      if (!isNaN(+newValue)) {
        setFirstCurrency({ ...firstCurrency, value: +newValue });
      }
    }
  };

  const handleChangeOption = (
    e: React.ChangeEvent<HTMLSelectElement>,
    isFirst: boolean
  ) => {
    const newValue = e.target.value;
    if (isFirst) {
      if (newValue === secondCurrency.currency) {
        setSecondCurrency({
          value: firstCurrency.value,
          currency: firstCurrency.currency,
        });
        setFirstCurrency({
          currency: newValue,
          value: secondCurrency.value,
        });
      } else {
        setFirstCurrency({ ...firstCurrency, currency: newValue });
      }
    } else {
      if (newValue === firstCurrency.currency) {
        setFirstCurrency({
          value: secondCurrency.value,
          currency: secondCurrency.currency,
        });
        setSecondCurrency({
          currency: newValue,
          value: firstCurrency.value,
        });
      } else {
        setSecondCurrency({ ...secondCurrency, currency: newValue });
      }
    }
  };

  return (
    <div className="h-screen w-full flex flex-col justify-between items-center p-1">
      <h1 className="text-3xl font-semibold text-center">Currency Converter</h1>
      <div className="w-full flex flex-col gap-2 justify-center items-center">
        <div className="w-full sm:w-1/2 flex border-4 rounded-md">
          <div className="w-1/2 flex flex-col md:flex-row">
            <select
              className="border-b border-r p-1"
              onChange={(e) => handleChangeOption(e, true)}
              value={firstCurrency.currency}
            >
              {currencies.map((cur) => (
                <option key={cur} value={cur}>
                  {cur}
                </option>
              ))}
            </select>
            <input
              className="w-full border-r p-1 outline-none"
              type="number"
              value={firstCurrency.value}
              onChange={handleChange}
            />
          </div>
          <div className="w-1/2 flex flex-col md:flex-row">
            <select
              className="border-b border-r p-1"
              onChange={(e) => handleChangeOption(e, false)}
              value={secondCurrency.currency}
            >
              {currencies.map((cur) => (
                <option key={cur} value={cur}>
                  {cur}
                </option>
              ))}
            </select>
            <input
              className="w-full p-1 outline-none"
              type="number"
              value={secondCurrency.value}
              readOnly
            />
          </div>
        </div>
        <h1>Last time updated: {timeUpdated}</h1>
      </div>
      <h1 className="text-3xl font-semibold text-center">
        Thx for checking out❤️
      </h1>
    </div>
  );
}
