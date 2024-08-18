import { OrderType } from "../slices/orderSlice";




function getMonthlyOrderCounts(orders: OrderType[], year: number):{ name: string, count: number }[] {
    const monthlyOrderCounts: { name: string, count: number }[] = [];
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyOrderCountsArray = Array(12).fill(0);

    const ordersForThisYear = orders.filter(order => {
        if (order.createdAt) {
            const orderDate = new Date(order.createdAt);
            return orderDate.getFullYear() === year;
        }
        return false;
    });

    ordersForThisYear.forEach((order) => {
        if (order.createdAt) {
            const orderDate = new Date(order.createdAt);
            const month = orderDate.getMonth(); 
            monthlyOrderCountsArray[month]++;
        }
    });

    months.forEach((month, index) => {
        monthlyOrderCounts.push({ name:month, count: monthlyOrderCountsArray[index] });
        
    });

    return monthlyOrderCounts;
}

export default getMonthlyOrderCounts;