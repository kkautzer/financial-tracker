export default function Budget() {
    // to make a partially-filled background, use a linear gradient as seen in the following example
    const pctFill = 35;
    return <div 
        style={{backgroundImage: `linear-gradient(to right, green ${pctFill}%, transparent ${pctFill}%)`}}
        className="bg-base-100"
    >
        <p>This is the budget page!!</p>
    </div>
}