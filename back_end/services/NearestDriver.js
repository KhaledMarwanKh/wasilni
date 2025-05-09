const turf = require('@turf/turf');

class NearestDriver {
  constructor(user_start, availableDrivers, maxDis) {
    this.user_start = user_start;
    this.availableDrivers = availableDrivers;
    this.maxDis = maxDis;
  }

  closesetDriversOnStart() {
    return this.availableDrivers
      .map((driver) => {
        // maxDis: distacne that vehicle is valid if different
        // betweeen user and vehicle was less than driver.distance
        const distance = parseFloat(
          turf
            .distance(
              turf.point(this.user_start.coordinates),
              turf.point(driver.location.coordinates),
              { units: 'kilometers' }
            )
            .toFixed(2)
        );

        return { driver, distance };
      })
      .filter(({ distance }) => distance <= this.maxDis)
      .map(({ driver }) => driver); // Extract just the driver objects
  }

  getClosestDriver() {
    let result = {};
    this.availableDrivers.map((driver) => {
      const distance = turf.distance(
        turf.point(this.user_start.coordinates),
        turf.point(driver.location.coordinates),
        { units: 'kilometers' }
      );

      if (distance < this.maxDis) {
        this.maxDis = distance;
        result = driver;
      }
    });
    return result;
  }
}

module.exports = NearestDriver;
