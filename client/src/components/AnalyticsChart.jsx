import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";


function AnalyticsChart({ summary }) {

    const data = [

        {
            name: "Impressions",
            value: summary.totalImpressions
        },

        {
            name: "Clicks",
            value: summary.totalClicks
        },

        {
            name: "Conversions",
            value: summary.totalConversions
        }

    ];


    return (

        <div className="chart-card">

            <h2>
                Overall Performance
            </h2>

            <div className="chart-container">

                <ResponsiveContainer
                    width="100%"
                    height={350}
                >

                    <BarChart data={data}>

                        <CartesianGrid
                            strokeDasharray="3 3"
                        />

                        <XAxis
                            dataKey="name"
                        />

                        <YAxis />

                        <Tooltip />

                        <Bar
                            dataKey="value"
                        />

                    </BarChart>

                </ResponsiveContainer>

            </div>

        </div>

    );
}


export default AnalyticsChart;