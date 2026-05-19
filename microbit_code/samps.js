/**
 * ########################
 * 
 * ### Global variables ###
 * 
 * ########################
 */
let soil_moisture_plant3 = 0
let soil_moisture_plant2 = 0
let soil_moisture_plant1 = 0
let plant3_on = false
let plant2_on = false
let plant1_on = false
let total_hours = 0
let total_seconds = 0
let elapsed_sec = 0
// Current hour is intialized here to be global,
// but all of the "current_"-units are updated continuously
// inside the timekeeping function.
let current_hr = 0
// Current minute is intialized here to be global.
let current_min = 0
// Current second is intialized here to be global.
let current_sec = 0
let total_minutes = 0
let blink_phase = false
// Setting the RTC to the current date/time
// Time must be set manually for cheaper Micro:bits without time-crystal.
// Format: DateTime(year, month, day, hour, minute, second)
RTC_DS1307.DateTime(
2025,
12,
5,
17,
0,
0
)
// Starting milliseconds for simulated (session-refreshed) timekeeping,
// to demonstrate the code on a simple Micro:bit without a crystal.
let start_ms = control.millis()
// Offset in hours to simulate a later time of day, from midnight in hours.
// Set the hour-offset to the 0–23 range.
let simulated_offset_hours = 12
// Set the minute-offset to the 0–59 range.
let simulated_offset_minutes = 30
// Set the second-offset to the 0–59 range.
let simulated_offset_seconds = 30
// Simulated offset time totals, in seconds.
let simulated_offset_time = simulated_offset_seconds + simulated_offset_minutes * 60 + simulated_offset_hours * 3600
// Visual confirmation
basic.showIcon(IconNames.Yes)
// The starting hour for the plant-lights. Plants' light-hours start from here.
let plantlight_start_hr = 7
let plant1_name = "lemon tree"
let plant1_light_hours = 10
// Relative light-strength compared to other plants. Assuming 20 000 lux = 100%.
let plant1_luminosity = 100
// Lemon tree's minimum moisture threshold in percent, 45%.
// Note that lower values are drier for these particular sensors, and they use a 0 to 100 scale.
let plant1_soil_moisture_min = 40
let plant1_soil_moisture_max = 70
let plant2_name = "peperomia"
let plant2_light_hours = 12
// Relative light-strength compared to other plants. Assuming 20 000 lux = 100%.
let plant2_luminosity = 40
// Peperomia's minimum moisture threshold in percent, 40%.
// Note that lower values are drier for these particular sensors, and they use a 0 to 100 scale.
let plant2_soil_moisture_min = 40
let plant2_soil_moisture_max = 70
let plant3_name = "aloe vera"
let plant3_light_hours = 10
// Relative light-strength compared to other plants. Assuming 20 000 lux = 100%.
let plant3_luminosity = 90
// Aloe vera's minimum moisture threshold in percent, 10%.
// Note that lower values are drier for these particular sensors, and they use a 0 to 100 scale.
let plant3_soil_moisture_min = 10
let plant3_soil_moisture_max = 35
// Signal LEDs are now simple pins, no NeoPixel needed.
// let signal_led_plant1 = neopixel.create(DigitalPin.P6, 1, NeoPixelMode.RGB)
// let signal_led_plant2 = neopixel.create(DigitalPin.P7, 1, NeoPixelMode.RGB)
// let signal_led_plant3 = neopixel.create(DigitalPin.P9, 1, NeoPixelMode.RGB)
let strip_plant1 = neopixel.create(DigitalPin.P13, 1, NeoPixelMode.RGB)
let strip_plant2 = neopixel.create(DigitalPin.P14, 1, NeoPixelMode.RGB)
let strip_plant3 = neopixel.create(DigitalPin.P15, 1, NeoPixelMode.RGB)
// ###############################
// ###############################
// #####  Main program loop  #####
// ###############################
// ###############################
// This loop contains timekeeping, moisture-logic,
// and plantlight-logic. It also logs stuff to the output-display.
basic.forever(function () {
    // #####################
    // ### Hardware-prep ###
    // #####################
    // Disabling the OLED-display to free up the pins shared with it.
    // This is in case the pins connected to the signalling LEDs
    // need the pin for themselves to function optimally.
    led.enable(false)
    // #########################
    // ### Timekeeping-logic ###
    // #########################
    // Timekeeping is simulated/on a session basis for now.
    // RTC can be used instead when the proper hardware is available.
    elapsed_sec = Math.idiv(control.millis() - start_ms, 1000)
    // Applying the full simulated offset in seconds to the total seconds.
    total_seconds = elapsed_sec + simulated_offset_time
    // ## Deriving time components
    // Total hours since start, including fractional days.
    total_hours = Math.idiv(total_seconds, 3600)
    // Current hour in 0–23 range, wrapping around.
    current_hr = (total_hours % 24 + 24) % 24
    // Current minute in 0–59 range, wrapping around.
    current_min = Math.idiv(total_seconds % 3600, 60)
    // Current second in 0–59 range, wrapping around.
    current_sec = (total_seconds % 60 + 60) % 60
    let hh = current_hr < 10 ? "0" + current_hr : "" + current_hr
let mm = current_min < 10 ? "0" + current_min : "" + current_min
let ss = current_sec < 10 ? "0" + current_sec : "" + current_sec
// Elapsed hours for the session and simulated offset.
    serial.writeLine("Current time (simulated): " + hh + ":" + mm + ":" + ss)
    // ########################
    // ### Plantlight-logic ###
    // ########################
    // // Debug-code to test if Rainbow-LEDs can turn on and off.
    // // Comment out when not in use.
    // strip_plant1.showColor(neopixel.hsl(40, 0, plant1_luminosity))
    // strip_plant1.show()
    // basic.pause(2000)
    // Logic for automated light-duration and light-intensity.
    plant1_on = current_hr >= plantlight_start_hr && current_hr < plantlight_start_hr + plant1_light_hours
    if (plant1_on) {
        // A saturation of 0 removes all color,
        // so results in white/grey light, so hue doesn't really matter.
        strip_plant1.showColor(neopixel.hsl(40, 0, plant1_luminosity))
    } else {
        strip_plant1.clear()
    }
    // Logic for automated light-duration and light-intensity.
    plant2_on = current_hr >= plantlight_start_hr && current_hr < plantlight_start_hr + plant2_light_hours
    if (plant2_on) {
        // A saturation of 0 removes all color,
        // so results in white/grey light, so hue doesn't really matter.
        strip_plant2.showColor(neopixel.hsl(40, 0, plant2_luminosity))
    } else {
        strip_plant2.clear()
    }
    // Logic for automated light-duration and light-intensity.
    plant3_on = current_hr >= plantlight_start_hr && current_hr < plantlight_start_hr + plant3_light_hours
    if (plant3_on) {
        // A saturation of 0 removes all color,
        // so results in white/grey light, so hue doesn't really matter.
        strip_plant3.showColor(neopixel.hsl(40, 0, plant3_luminosity))
    } else {
        strip_plant3.clear()
    }
    // Updating the Rainbow-LEDs' states,
    // after the correct values are set.
    strip_plant1.show()
    strip_plant2.show()
    strip_plant3.show()
    // ###########################
    // ### Soil moisture-logic ###
    // ###########################
    // Display of soil moisture, for interface-display and debugging.
    // Also holds logic for moisture measuring and watering-signals.
    // Finally pauses for a short time (maybe for 1 or more seconds), so the debugging log is not excessively filled.
    // Reset to 0 on each loop to ensure the readings are fresh.
    // Actual readings.
    soil_moisture_plant1 = Environment.ReadSoilHumidity(AnalogPin.P1)
    soil_moisture_plant2 = Environment.ReadSoilHumidity(AnalogPin.P2)
    soil_moisture_plant3 = Environment.ReadSoilHumidity(AnalogPin.P3)
    // ## Plant 1 Signal LED ##
    // Simple LEDs need simple on/off logic
    if (soil_moisture_plant1 <= plant1_soil_moisture_min) {
        // For clean blinking that doesn't delay the loop,
        // we simply switch the signal-LED to the opposite state
        // for each loop iteration. –Jon
        pins.digitalWritePin(DigitalPin.P6, blink_phase ? 1 : 0)
    } else if (soil_moisture_plant1 >= plant1_soil_moisture_max) {
        pins.digitalWritePin(DigitalPin.P6, 1)
    } else {
        pins.digitalWritePin(DigitalPin.P6, 0)
    }
    // ## Plant 2 Signal LED ##
    // Simple LEDs need simple on/off logic
    if (soil_moisture_plant2 <= plant2_soil_moisture_min) {
        // For clean blinking that doesn't delay the loop,
        // we simply switch the signal-LED to the opposite state
        // for each loop iteration. –Jon
        pins.digitalWritePin(DigitalPin.P7, blink_phase ? 1 : 0)
    } else if (soil_moisture_plant2 >= plant2_soil_moisture_max) {
        pins.digitalWritePin(DigitalPin.P7, 1)
    } else {
        pins.digitalWritePin(DigitalPin.P7, 0)
    }
    // ## Plant 3 Signal LED ##
    // Simple LEDs need simple on/off logic
    if (soil_moisture_plant3 <= plant3_soil_moisture_min) {
        // For clean blinking that doesn't delay the loop,
        // we simply switch the signal-LED to the opposite state
        // for each loop iteration. –Jon
        pins.digitalWritePin(DigitalPin.P9, blink_phase ? 1 : 0)
    } else if (soil_moisture_plant3 >= plant3_soil_moisture_max) {
        pins.digitalWritePin(DigitalPin.P9, 1)
    } else {
        pins.digitalWritePin(DigitalPin.P9, 0)
    }
    serial.writeLine("Soil moisture of plant 1 (" + plant1_name + "): " + soil_moisture_plant1)
    serial.writeLine("Soil moisture of plant 2 (" + plant2_name + "): " + soil_moisture_plant2)
    serial.writeLine("Soil moisture of plant 3 (" + plant3_name + "): " + soil_moisture_plant3)
    // Debug lines for raw values.
    // serial.writeLine("RAW1=" + soil_moisture_plant1)
    // serial.writeLine("RAW2=" + soil_moisture_plant2)
    // serial.writeLine("RAW3=" + soil_moisture_plant3)
    serial.writeLine("------------------------------------------")
    // Switching the blink phase for plants in the state to use this.
    // It's common for all plants to synchronize blinking.
    blink_phase = !(blink_phase)
    basic.pause(1000)
})
