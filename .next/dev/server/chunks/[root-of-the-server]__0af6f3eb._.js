module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createBooking",
    ()=>createBooking,
    "database",
    ()=>database,
    "getAnalytics",
    ()=>getAnalytics,
    "getBookings",
    ()=>getBookings,
    "getParkingLots",
    ()=>getParkingLots,
    "getParkingSlots",
    ()=>getParkingSlots,
    "getSlotsByStatus",
    ()=>getSlotsByStatus,
    "initializeSlots",
    ()=>initializeSlots,
    "logSensorData",
    ()=>logSensorData,
    "updateSlotStatus",
    ()=>updateSlotStatus
]);
const database = {
    parkingLots: [
        {
            id: 1,
            name: 'Downtown Plaza',
            address: '123 Main Street',
            total_slots: 120,
            city: 'New York',
            available_slots: 24
        },
        {
            id: 2,
            name: 'Central Station',
            address: '456 Station Ave',
            total_slots: 200,
            city: 'New York',
            available_slots: 45
        },
        {
            id: 3,
            name: 'Mall Parking',
            address: '789 Shopping Way',
            total_slots: 150,
            city: 'New York',
            available_slots: 12
        },
        {
            id: 4,
            name: 'Business District',
            address: '321 Corporate Blvd',
            total_slots: 180,
            city: 'New York',
            available_slots: 67
        }
    ],
    slots: [],
    bookings: [],
    users: [],
    sensorLogs: []
};
function initializeSlots() {
    const slots = [];
    const sensorTypes = [
        'PIR',
        'Ultrasonic',
        'Camera',
        'Magnetic'
    ];
    database.parkingLots.forEach((lot)=>{
        for(let i = 1; i <= lot.total_slots; i++){
            const isOccupied = Math.random() < 0.65;
            slots.push({
                id: slots.length + 1,
                lot_id: lot.id,
                slot_number: `${String.fromCharCode(64 + Math.ceil(i / 20))}-${String(i % 20 || 20).padStart(2, '0')}`,
                slot_type: i % 10 === 0 ? 'ev_charging' : i % 15 === 0 ? 'disabled' : 'standard',
                status: isOccupied ? 'booked' : 'available',
                occupancy_status: isOccupied ? 'occupied' : 'empty',
                sensor_id: `SENSOR-${lot.id}-${i}`,
                last_sensor_update: new Date().toISOString()
            });
        }
    });
    database.slots = slots;
}
async function getParkingLots() {
    return database.parkingLots;
}
async function getParkingSlots(lotId) {
    if (lotId) {
        return database.slots.filter((s)=>s.lot_id === lotId);
    }
    return database.slots;
}
async function getSlotsByStatus(status) {
    return database.slots.filter((s)=>s.status === status);
}
async function updateSlotStatus(slotId, status) {
    const slot = database.slots.find((s)=>s.id === slotId);
    if (slot) {
        slot.status = status;
        slot.occupancy_status = status === 'booked' ? 'occupied' : 'empty';
        slot.last_sensor_update = new Date().toISOString();
    }
    return slot;
}
async function createBooking(booking) {
    const newBooking = {
        id: database.bookings.length + 1,
        user_id: booking.user_id,
        slot_id: booking.slot_id,
        booking_reference: `BK-${Date.now()}`,
        start_time: booking.start_time,
        end_time: booking.end_time || null,
        booking_status: 'pending',
        total_amount: booking.total_amount || 0,
        vehicle_number: booking.vehicle_number
    };
    database.bookings.push(newBooking);
    return newBooking;
}
async function getBookings(userId) {
    if (userId) {
        return database.bookings.filter((b)=>b.user_id === userId);
    }
    return database.bookings;
}
async function logSensorData(sensorData) {
    database.sensorLogs.push({
        id: database.sensorLogs.length + 1,
        timestamp: new Date().toISOString(),
        ...sensorData
    });
}
async function getAnalytics(lotId, date) {
    const dateStr = date || new Date().toISOString().split('T')[0];
    const lotBookings = database.bookings.filter((b)=>b.lot_id === lotId);
    const totalRevenue = lotBookings.reduce((sum, b)=>sum + b.total_amount, 0);
    return {
        lot_id: lotId,
        date: dateStr,
        total_bookings: lotBookings.length,
        total_revenue: totalRevenue,
        average_occupancy: (database.slots.filter((s)=>s.lot_id === lotId && s.occupancy_status === 'occupied').length / database.slots.filter((s)=>s.lot_id === lotId).length * 100).toFixed(2)
    };
}
}),
"[project]/app/api/bookings/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.ts [app-route] (ecmascript)");
;
;
async function GET(request) {
    try {
        const userId = request.nextUrl.searchParams.get('user_id');
        const bookings = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getBookings"])(userId ? parseInt(userId) : undefined);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: bookings,
            count: bookings.length
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Failed to fetch bookings'
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const body = await request.json();
        const { user_id, slot_id, lot_id, start_time, expected_duration_minutes, vehicle_number, total_amount } = body;
        if (!user_id || !slot_id || !lot_id || !start_time) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Missing required fields'
            }, {
                status: 400
            });
        }
        const booking = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createBooking"])({
            user_id,
            slot_id,
            start_time,
            total_amount,
            vehicle_number
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: 'Booking created successfully',
            data: booking
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Failed to create booking'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0af6f3eb._.js.map