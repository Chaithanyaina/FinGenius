import { useData } from '../hooks/useData';
import Header from '../components/layout/Header';
import { Link } from 'react-router-dom';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { subMonths } from 'date-fns';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Profile = () => {
  const { transactions } = useData();

  const last30Days = subMonths(new Date(), 1);
  const monthlyTransactions = transactions.filter(t => new Date(t.date) > last30Days);

  const incomeByCat = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
    }, {} as Record<string, number>);
  
  const expenseByCat = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
    }, {} as Record<string, number>);

  const incomeChartData = Object.entries(incomeByCat).map(([name, value]) => ({ name, value }));
  const expenseChartData = Object.entries(expenseByCat).map(([name, value]) => ({ name, value }));
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  }

  return (
    <div className="w-full min-h-screen bg-background p-6 md:p-8">
        <div className="max-w-screen-xl mx-auto">
            <Header />
            <main className="flex-1 py-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold">Your Financial Profile</h1>
                        <p className="text-foreground/60">An overview of your financial health for the last 30 days.</p>
                    </div>
                    <Link to="/settings" className="px-4 py-2 bg-primary/20 text-primary font-semibold rounded-lg hover:bg-primary/30 transition-colors">
                        Edit Profile
                    </Link>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="glass-card p-4 h-[400px]">
                        <h3 className="text-lg font-semibold mb-4 text-center">Income by Category</h3>
                        <ResponsiveContainer width="100%" height="90%">
                           <PieChart>
                                <Pie data={incomeChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8">
                                    {/* FIX: Changed 'entry' to '_entry' to mark it as unused */}
                                    {incomeChartData.map((_entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="glass-card p-4 h-[400px]">
                        <h3 className="text-lg font-semibold mb-4 text-center">Expense by Category</h3>
                         <ResponsiveContainer width="100%" height="90%">
                           <PieChart>
                                <Pie data={expenseChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#82ca9d">
                                    {/* FIX: Changed 'entry' to '_entry' to mark it as unused */}
                                    {expenseChartData.map((_entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                 <Link to="/" className="text-primary hover:underline mt-8 inline-block">
                    &larr; Back to Dashboard
                </Link>
            </main>
        </div>
    </div>
  );
};

export default Profile;