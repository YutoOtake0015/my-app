import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import apiClient from "../src/lib/apiClient";

const timeStyle = { width: "1.2rem", display: "inline-block" };

const RemainingLife = ({ person }) => {
  const router = useRouter();
  const [year, setYear] = useState<number>();
  const [month, setMonth] = useState<number>();
  const [day, setDay] = useState<number>();
  const [hour, setHour] = useState<number>();
  const [minute, setMinute] = useState<number>();
  const [second, setSecond] = useState<number>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (person) {
          // 寿命を取得
          const remainingLifeForSeconds = await getLifeSpanForSeconds(
            person.sex,
          );

          // 単位ごとに時間をセット
          setTime(remainingLifeForSeconds.remainTime);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [person]);

  const getLifeSpanForSeconds = async (sex) => {
    const fetchData = await apiClient.get("/life/lifespan", {
      params: { sex: sex, year: person.birthDate },
    });
    return fetchData.data;
  };

  const setTime: (totalSeconds: number) => void = (totalSeconds) => {
    // 各単位の秒
    const secondsInMinute = 60;
    const secondsInHour = 60 * secondsInMinute;
    const secondsInDay = 24 * secondsInHour;
    const secondsInMonth = 30 * secondsInDay; // 簡易的な月の秒数
    const secondsInYear = 365 * secondsInDay; // 簡易的な年の秒数

    // カウントダウン処理
    const countdownInterval = setInterval(() => {
      if (totalSeconds > 0) {
        // 時間を単位ごとに算出
        const years = Math.floor(totalSeconds / secondsInYear);
        const remainingSecondsAfterYear = totalSeconds % secondsInYear;

        const months = Math.floor(remainingSecondsAfterYear / secondsInMonth);
        const remainingSecondsAfterMonth =
          remainingSecondsAfterYear % secondsInMonth;

        const days = Math.floor(remainingSecondsAfterMonth / secondsInDay);
        const remainingSecondsAfterDay =
          remainingSecondsAfterMonth % secondsInDay;

        const hours = Math.floor(remainingSecondsAfterDay / secondsInHour);
        const remainingSecondsAfterHour =
          remainingSecondsAfterDay % secondsInHour;

        const minutes = Math.floor(remainingSecondsAfterHour / secondsInMinute);
        const seconds = remainingSecondsAfterHour % secondsInMinute;

        // 状態セット
        setYear(years);
        setMonth(months);
        setDay(days);
        setHour(hours);
        setMinute(minutes);
        setSecond(seconds);

        // 残り秒数を減算
        totalSeconds -= 1;
      } else {
        // カウントダウンが終了したらクリア
        clearInterval(countdownInterval);
      }
    }, 1000); // 1秒ごとに更新
  };

  return (
    <>
      <span style={timeStyle}>{year}</span>年
      <span style={timeStyle}>{month}</span>
      ヵ月
      <span style={timeStyle}>{day}</span>日
      <span style={timeStyle}>{hour}</span>
      時間
      <span style={timeStyle}>{minute}</span>分
      <span style={timeStyle}>{second}</span>秒
    </>
  );
};

export default RemainingLife;