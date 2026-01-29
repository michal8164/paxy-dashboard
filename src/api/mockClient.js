import { subDays } from "date-fns";

export const createMockClient = () => {
    console.log("Initializing Realistic Mock Client");

    const carriers = ["DPD", "DHL", "GLS", "FedEx", "UPS", "TNT", "Colissimo", "Hermes", "PostNL", "InPost"];

    // Country to City mapping for realistic data
    const destinations = {
        "Belgium": ["Brussels", "Antwerp"],
        "France": ["Paris", "Lyon", "Marseille"],
        "Germany": ["Berlin", "Munich", "Hamburg"],
        "Austria": ["Vienna", "Salzburg"],
        "Netherlands": ["Amsterdam", "Rotterdam"],
        "Poland": ["Warsaw", "Krakow"],
        "Switzerland": ["Zurich", "Geneva"],
        "Spain": ["Madrid", "Barcelona"]
    };

    const countries = Object.keys(destinations);

    const statuses = ["delivered", "in_transit", "out_for_delivery", "pending", "failed", "picked_up", "returned"];
    const customersList = [
        { id: "cust-1", name: "TechStore GmbH", email: "contact@techstore.de" },
        { id: "cust-2", name: "SportsPro NL", email: "info@sportspro.nl" },
        { id: "cust-3", name: "ElectroMax France", email: "sales@electromax.fr" },
        { id: "cust-4", name: "Fashion Forward Ltd", email: "orders@fashionforward.com" },
        { id: "cust-5", name: "HomeGoods Italia", email: "support@homegoods.it" }
    ];

    // Helper to get random item
    const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

    // Helper to generate a random date in Jan 2026 or recent
    const getRandomDate = () => {
        const start = new Date('2026-01-01').getTime();
        const end = new Date('2026-01-30').getTime();
        const date = new Date(start + Math.random() * (end - start));
        return date.toISOString();
    };

    const generateParcels = (count) => {
        return Array.from({ length: count }).map((_, i) => {
            const customer = getRandom(customersList);
            const status = i < count * 0.4 ? 'delivered' : getRandom(statuses); // Bias towards delivered
            const country = getRandom(countries);
            const city = getRandom(destinations[country]);
            const created = getRandomDate();

            return {
                id: `pcl-${i}-${Date.now()}`,
                tracking_number: `${getRandom(carriers).toUpperCase()}${Math.floor(1000000000 + Math.random() * 9000000000)}`,
                created_date: created,
                shipped_date: created, // Using same date for simplicity in display
                carrier: getRandom(carriers),
                status: status,
                destination_country: country,
                destination_city: city,
                customer_id: customer.id,
                customer_name: customer.name,
                // Add fields for detailed view if needed
                timestamp: created,
                last_update: created,
            };
        });
    };

    const generateCustomers = (count) => {
        return customersList.map(c => ({
            ...c,
            created_date: getRandomDate(),
            status: 'active'
        }));
    };

    const mockParcelMethods = {
        list: async (sort, limit) => {
            console.log("Mock Parcel list", sort, limit);
            return generateParcels(50); // Generate 50 parcels to populate charts
        },
        filter: async (criteria) => {
            console.log("Mock Parcel filter", criteria);
            return [];
        },
        get: async (id) => ({ id, ...generateParcels(1)[0] })
    };

    const mockCustomerMethods = {
        list: async (sort, limit) => {
            console.log("Mock Customer list");
            return generateCustomers();
        },
        filter: async () => [],
        get: async (id) => ({ id, name: "Mock Customer" })
    };

    const mockGenericMethods = {
        list: async () => [],
        filter: async () => [],
        get: async (id) => ({ id })
    };

    const entitiesProxy = new Proxy({}, {
        get: (target, prop) => {
            console.log(`Accessing mock entity: ${String(prop)}`);
            if (prop === 'Parcel') return mockParcelMethods;
            if (prop === 'Customer') return mockCustomerMethods;
            return mockGenericMethods;
        }
    });

    return {
        auth: {
            me: async () => ({
                id: 'mock-admin',
                email: 'admin@paxy.io',
                firstName: 'Admin',
                lastName: 'User'
            }),
            logout: () => window.location.reload(),
            redirectToLogin: () => { }
        },
        entities: entitiesProxy,
        appLogs: {
            logUserInApp: async () => { }
        }
    };
};
