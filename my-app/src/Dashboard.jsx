import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import { GrCircleInformation } from 'react-icons/gr';
import { Tooltip } from 'react-tooltip';
import DonutChart from './components/UI/DonutChart.jsx';

const supabaseUrl = 'https://slgvzdffablpziwwlvkv.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsZ3Z6ZGZmYWJscHppd3dsdmt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTgxNDc2NTcsImV4cCI6MjAxMzcyMzY1N30.xWYI8u8Gg7qLQfAyP-L8M7h00jyA4MPngvYOTx-YJXE';
const supabase = createClient(supabaseUrl, supabaseKey);

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [score, setScore] = useState(undefined);
  const [formattedSpeedData, setFormattedSpeedData] = useState([]);
  const [infractionScore, setInfractionScore] = useState(undefined);
  const [formattedBrakeData, setFormattedBrakeData] = useState([]);
  const [brakeScore, setBrakeScore] = useState(undefined);
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('All_test')
        .select('*')
        .order('interval');
      if (data) {
        setData(data);
        console.log(data);
        const safetyData = data.map((item) => {
          // Define weights for each factor (you can adjust these weights as needed)
          const speedWeight = 0.4;
          const hardBrakeWeight = 0.4;
          const perclosWeight = 0.2;

          // Normalize each factor to a scale of 0 to 1 (if not already)
          const normalizedSpeed = item.speed_infraction / 5; // Normalize to 0-1
          const normalizedHardBrake = item.hard_brake / 5; // Normalize to 0-1
          const normalizedPerclos = item.perclos_score; // Already in the 0-1 range

          // Calculate the safety index using the weighted formula
          const safetyIndex =
            speedWeight * normalizedSpeed +
            hardBrakeWeight * normalizedHardBrake +
            perclosWeight * normalizedPerclos;

          return {
            interval: item.interval,
            safety_index: safetyIndex,
          };
        });
        console.log(safetyData);

        const averageSafetyScore =
          safetyData.reduce(
            (acc, item) => acc + parseFloat(item.safety_index),
            0
          ) / safetyData.length;

        console.log(averageSafetyScore.toFixed(2));
        setScore(averageSafetyScore.toFixed(2));

        const formattedSpeedData = data
          .sort((a, b) => a.interval - b.interval)
          .map((item) => ({
            interval: item.interval * 5,
            speed_infraction: item.speed_infraction,
          }));
        setFormattedSpeedData(formattedSpeedData);
        const sumSpeedInfractions = formattedSpeedData.reduce(
          (sum, data) => sum + data.speed_infraction,
          0
        );

        const averageSpeedInfraction =
          sumSpeedInfractions / formattedSpeedData.length;
        setInfractionScore(averageSpeedInfraction);

        const formattedBrakeData = [...data]
          .sort((a, b) => a.interval - b.interval)
          .map((item) => ({
            interval: item.interval * 5,
            hard_brake: item.hard_brake,
          }));
        console.log(formattedBrakeData);

        setFormattedBrakeData(formattedBrakeData);
        const sumBrakes = formattedBrakeData.reduce(
          (sum, data) => sum + data.hard_brake,
          0
        );
        console.log(sumBrakes);

        const averageBrakes = sumBrakes / formattedSpeedData.length;
        setBrakeScore(averageBrakes);
      } else if (error) {
        console.error('Error fetching speed data:', error);
      }
    };
    fetchData();
  }, []);

  const speedData = [...data]
    .sort((a, b) => a.interval - b.interval)
    .map((item) => ({
      interval: item.interval * 5,
      speed: item.speed,
    }));

  console.log(formattedBrakeData);
  console.log(speedData);
  function convertNumberToFormat(number) {
    if (typeof number !== 'number' || number < 0 || number > 1) {
      // Handle invalid input, e.g., numbers outside the range [0, 1]
      return [];
    }

    const formattedValue = { value: number, label: 'Score' };
    const complementValue = { value: 1 - number, label: 'Score' };

    return [formattedValue, complementValue];
  }
  function getSafetyMessage(score) {
    if (score >= 50) {
      return (
        <div className="pb-2">
          <p>You are a hazardous rider.</p>
          <p>Please drive safely to keep yourself and others safe!</p>
        </div>
      );
    } else if (score >= 25) {
      return (
        <div className="pb-2">
          <p>You are an unsafe rider.</p>
          <p>Please drive safely to keep yourself and others safe!</p>
        </div>
      );
    } else {
      return (
        <div className="pb-2">
          <p>You are a safe rider.</p>
          <p>Thank you for keeping yourself and others safe!</p>
        </div>
      );
    }
  }
  function SpeedInfraction({ score }) {
    let textClass = 'text-green-500 dark:text-green-400';
    let message = 'Thank you for driving at a safe speed!';

    if (score >= 15) {
      textClass = 'text-red-500 dark:text-red-400';
      message = `Let's consider driving slower...`;
    } else if (score >= 5) {
      textClass = 'text-yellow-500 dark:text-yellow-400';
      message = `Please drive slower...`;
    }

    return (
      <p>
        Your speed infraction count is{' '}
        <span className={textClass}>{score}</span>. <br /> {message}
      </p>
    );
  }
  function BrakeInfraction({ score }) {
    let textClass = 'text-green-500 dark:text-green-400';
    let message = 'Thank you for driving smoothly!';

    if (score >= 15) {
      textClass = 'text-red-500 dark:text-red-400';
      message = `Let's consider driving better...`;
    } else if (score >= 5) {
      textClass = 'text-yellow-500 dark:text-yellow-400';
      message = `Please drive better...`;
    }

    return (
      <p>
        Your hard brake count is <span className={textClass}>{score}</span>.{' '}
        <br /> {message}
      </p>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-center">
        <div className="mx-auto">
          <div className="">
            <div className="inline-block">Speed Infractions</div>
            <GrCircleInformation
              className="inline-block float-right"
              id="speed"
            />
            <Tooltip anchorSelect="#speed"  style={{ zIndex: 1000 }}>
              <button>
                This shows the the frequency <br /> of exceeding the speed
                limit.
                {infractionScore !== undefined && (
                  <SpeedInfraction score={infractionScore.toFixed(2)} />
                )}
              </button>
            </Tooltip>
          </div>
          <LineChart width={350} height={200} data={formattedSpeedData}>
            <XAxis dataKey="interval" interval={10} />
            <tooltip />
            <Line
              type="monotone"
              dataKey="speed_infraction"
              stroke="#000000"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <div className="mx-auto">
          <div className="">
            <div className="inline-block">Hard Brakes</div>
            <GrCircleInformation
              className="inline-block float-right"
              id="brake"
            />
            <Tooltip anchorSelect="#brake">
              <button>
                This shows the the <br />
                frequency of hard braking.
                {brakeScore !== undefined && (
                  <BrakeInfraction score={brakeScore.toFixed(2)} />
                )}
              </button>
            </Tooltip>
          </div>
          <LineChart width={350} height={200} data={formattedBrakeData}>
            <XAxis dataKey="interval" interval={10} />
            <tooltip />
            <Line
              type="monotone"
              dataKey="hard_brake"
              stroke="#000000"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <div className="mx-auto">
          <div className="">
            <div className="inline-block">Speed</div>
            <GrCircleInformation
              className="inline-block float-right"
              id="avgspeed"
            />
            <Tooltip anchorSelect="#avgspeed">
              <button>
                This shows the <br />
                the average speed.
              </button>
            </Tooltip>
          </div>
          <LineChart width={350} height={200} data={speedData}>
            <XAxis dataKey="interval" interval={10} />
            <tooltip />
            <Line
              type="monotone"
              dataKey="speed"
              stroke="#000000"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </div>
      </div>
      <div className="text-center mt-4">
        <h2 className="text-md font-semibold">Average Risk Score</h2>
        <div className="mx-auto " style={{ width: 'fit-content' }}>
          {score !== undefined ? (
            <DonutChart
              score={(1 - score).toFixed(2) * 100}
              data={convertNumberToFormat(1 - score)}
            />
          ) : (
            <p>Risk score is undefined.</p>
          )}
        </div>
        <div>{getSafetyMessage((1 - score).toFixed(2) * 100)}</div>
      </div>
    </div>
  );
};

export default Dashboard;
