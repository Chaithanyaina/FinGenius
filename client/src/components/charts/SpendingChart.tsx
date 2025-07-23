import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Transaction {
  type: string;
  category: string;
  amount: number;
}

interface SpendingChartProps {
  transactions: Transaction[];
}

const SpendingChart = ({ transactions }: SpendingChartProps) => {
  // Process transactions to group expenses by category
  const spendingData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      if (!acc[t.category]) {
        acc[t.category] = 0;
      }
      acc[t.category] += t.amount;
      return acc;
    }, {} as Record<string, number>);

  const chartData = Object.entries(spendingData).map(([name, spent]) => ({
    name,
    spent,
  }));

  return (
    <div className="glass-card p-4 h-[400px]">
       <h3 className="text-lg font-semibold mb-4 text-center">Monthly Spending by Category</h3>
      <ResponsiveContainer width="100%" height="90%">
        {chartData.length > 0 ? (
            <BarChart data={chartData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis type="number" stroke="#9ca3af" />
            <YAxis dataKey="name" type="category" stroke="#9ca3af" width={80} />
            <Tooltip 
                cursor={{ fill: 'rgba(255, 255, 255, 0.1)'}}
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none' }}
            />
            <Legend />
            <Bar dataKey="spent" fill="rgba(239, 68, 68, 0.6)" barSize={20} />
            </BarChart>
        ) : (
            <div className="flex items-center justify-center h-full text-foreground/60">
                <p>No expense data to display.</p>
            </div>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default SpendingChart;