import { Component } from 'react';
import { createClient } from '@supabase/supabase-js';
import { PerclosScoreContext } from '../CV/PerclosScoreContext'; // Import the context

const supabaseUrl = 'https://slgvzdffablpziwwlvkv.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsZ3Z6ZGZmYWJscHppd3dsdmt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTgxNDc2NTcsImV4cCI6MjAxMzcyMzY1N30.xWYI8u8Gg7qLQfAyP-L8M7h00jyA4MPngvYOTx-YJXE';
const supabase = createClient(supabaseUrl, supabaseKey);
const SPEEDLIMIT = 0.01;

class GPSAndSpeedTracker extends Component {
  static contextType = PerclosScoreContext; // Set the contextType
  constructor(props) {
    super(props);
    this.state = {
      coordinatesList: [],
      prevCoordinates: {
        // Initialize prevCoordinates as an object
        latitude: null, // You can use null or some other initial value
        longitude: null, // You can use null or some other initial value
      },
      averageSpeed: 0,

      speedInfractionCount: 0,
      id: props.currentId,

      readings: [],
      smoothingFactor: 10, // The number of readings to average
      hardBrakes: 0,
      debounceTimeout: null,

      interval: 1,
    };
    this.getCurrentLocation = this.getCurrentLocation.bind(this);
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    // console.log('staareuoadte');

    // Check if the currentId prop has changed
    if (nextProps.currentId !== prevState.id || prevState.id === null) {
      return {
        id: nextProps.currentId, // Update the id in state
        interval: 1,
      };
    }
    return null; // No state update is necessary
  }

  handleDeviceOrientation = (event) => {
    const { x, y, z } = event.accelerationIncludingGravity;
    const gForce = Math.sqrt(x ** 2 + y ** 2 + z ** 2) / 9.81;

    this.setState((prevState) => {
      const newReadings = [...prevState.readings, gForce];
      if (newReadings.length > prevState.smoothingFactor) {
        newReadings.shift();
      }

      const averageGForce =
        newReadings.reduce((a, b) => a + b) / newReadings.length;

      const threshold = 2;
      if (averageGForce > threshold) {
        this.recordHardBrake();
      }

      return {
        accelerationIncludingGravity: { x, y, z },
        readings: newReadings,
        maxGForce: Math.max(averageGForce, prevState.maxGForce),
      };
    });
  };

  recordHardBrake = () => {
    const now = Date.now();
    const delay = 300; //

    this.setState((prevState) => {
      if (
        prevState.debounceTimeout &&
        now - prevState.debounceTimeout < delay
      ) {
        // If the last hard brake was less than the delay ago, don't record a new hard brake
        return null;
      }

      const newTimeout = now + delay;

      return {
        hardBrakes: prevState.hardBrakes + 1,
        debounceTimeout: newTimeout,
      };
    });
  };

  componentDidMount() {
    this.intervalId = setInterval(this.getCurrentLocation, 1000);
    window.addEventListener('devicemotion', this.handleDeviceOrientation);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
    window.removeEventListener('devicemotion', this.handleDeviceOrientation);
  }
  async getCurrentLocation() {
    // if (this.state) {
    // console.log(this.state.id);
    // }
    if ('geolocation' in navigator) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude, timestamp } = position.coords;

        // Calculate speed and apply data smoothing
        if (this.state.prevCoordinates) {
          const timeDifference = 1; // 1 second
          const latDiff = latitude - this.state.prevCoordinates.latitude;
          const lonDiff = longitude - this.state.prevCoordinates.longitude;
          const distance = Math.sqrt(latDiff ** 2 + lonDiff ** 2) * 111139; // Approximation of 1 degree in meters
          const speedCmPerSec = distance / timeDifference;
          const speedKmPerHr = (speedCmPerSec * 360) / 1000; // Convert to kilometers per hour

          const updatedCoordinates = {
            latitude,
            longitude,
            timestamp: new Date().getTime(),
            speed: speedKmPerHr.toFixed(2),
          };

          this.setState((prevState) => ({
            coordinatesList: [...prevState.coordinatesList, updatedCoordinates],
          }));
        }

        this.setState({
          prevCoordinates: {
            latitude,
            longitude,
          },
        });

        this.setState({
          interval: this.state.interval + 1,
        });

        if (this.state.interval % 1 === 0) {
          const lastMinuteCoordinates = this.state.coordinatesList.filter(
            (coord) => coord.timestamp >= new Date().getTime() - 5000
          );

          if (lastMinuteCoordinates.length > 0) {
            const totalSpeed = lastMinuteCoordinates.reduce(
              (sum, coord) => sum + parseFloat(coord.speed || 0),
              0
            );

            const averageSpeed = (
              totalSpeed / lastMinuteCoordinates.length
            ).toFixed(2);

            this.setState({
              averageSpeed: parseFloat(averageSpeed),
            });

            if (this.state.averageSpeed > SPEEDLIMIT) {
              this.setState((prevState) => ({
                speedInfractionCount: prevState.speedInfractionCount + 1,
              }));
            }
          }
          // console.log(this.state.speedInfractionCount);
        }

        if (this.state.interval % 5 === 0) {
          if (this.state.id != null) {
            const { data, error } = await supabase
              .from('All')
              .upsert([
                {
                  id: this.state.id,
                  interval: this.state.interval / 5,
                  speed_infraction: this.state.speedInfractionCount,
                  speed: this.state.averageSpeed,
                  hard_brake: this.state.hardBrakes,
                  perclos_score: this.context.finalScore,
                },
              ])
              .select();

            if (error) {
              console.error('Error inserting data into the database:', error);
            }

            // Reset the speed infraction count
          } else {
            this.setState({ speedInfractionCount: 0 });
          }
        }
      } catch (error) {
        console.error('Error getting location:', error);
      }
    } else {
      console.error('Geolocation is not available in this browser.');
    }
  }

  render() {
    return null;
  }
}

export default GPSAndSpeedTracker;
