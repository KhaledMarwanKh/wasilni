class DriverSelection {
  selectDriverBasedOnBookings(closestDriverBookings) {
    let minBookingCount = Infinity;
    let selectedDriver = null;

    closestDriverBookings.forEach((driver) => {
      if (driver.bookingCount < minBookingCount) {
        minBookingCount = driver.bookingCount;
        selectedDriver = driver;
      }
    });

    return selectedDriver;
  }
}
module.exports = DriverSelection;
