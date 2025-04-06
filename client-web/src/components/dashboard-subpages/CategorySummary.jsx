export default function CategorySummary(props) {
    return <>
    <p className='text-lg'>{props.category+": $"+props.amt.toFixed(2)}</p>
    <p className="text-gray-500 ml-4">{props.qty}x | Avg. ${(props.amt / props.qty).toFixed(2)}</p>
</>
}