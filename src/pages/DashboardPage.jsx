function DashboardPage() {
    return (
        <div>
            <h2 className="text-3xl font-bold mb-4">Welcome to the Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-2">Card 1</h3>
                    <p className="text-gray-700">Content for card 1</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-2">Card 2</h3>
                    <p className="text-gray-700">Content for card 2</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-2">Card 3</h3>
                    <p className="text-gray-700">Content for card 3</p>
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;
