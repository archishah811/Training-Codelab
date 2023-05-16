import styles from "./TimeCurrencyCard.module.css"


/* 
:currency:
    the current chose currency
:type:
    string
:showData:
    array of bitcoin data object with timestamp and price
:type:
    list[{dict}]
*/
function TimeCurrencyCard({ currency, showData }) {
    // ToDo 10.2.1 
    /* 
    set price text color
    :index:
        the index of the current object
    :type:
        int
    :return:
        CSS classname
    :rtype:
        CSS  Object
    */
    const priceColor = (index) => {
        // index is 0
        if (index === 0) {
            return styles.priceContainerEqual;
        }
        // index > 0
        else if (index > 0) {
            if (showData[index - 1].price > showData[index].price) {
                return styles.priceContainerDown;
            }
            else if (showData[index - 1].price < showData[index].price) {
                return styles.priceContainerUp;
            } else {
                return styles.priceContainerEqual;
            }
        }
    }

    // ToDo 10.2.2
    /* 
    set arrow sign for price
    :index:
        the index of the current object
    :type:
        int
    :return:
        an arrow "↑" "↓" or '-' to show the price change status
    :rtype:
        string
    */
    const arrowSign = (index) => {
        if (index === 0) {
            return '-';
        }
        // index > 0
        else if (index > 0) {
            if (showData[index - 1].price > showData[index].price) {
                return "↓";
            }
            else if (showData[index - 1].price < showData[index].price) {
                return "↑";
            } else {
                return '-';
            }
        }
    }

    console.log(showData);
    // ToDo 10.2.3
    return (
        <div style={{ padding: "24px", display: "flex", flexWrap: "wrap" }}>
            {/* reference for .map https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map */}
            {showData.map((d, index) => (
                <div className={styles.cardContainer} key={index}>
                    {/* use {currency === 'USD' ? "$" : *other currency sign*} to set the currency notation  
                reference https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator */}
                    <p className={priceColor(index)}>{currency === 'USD' ? "$" : "Rs"} {d.price}{arrowSign(index)}</p>
                    <p>{d.timestamp}</p>
                </div>
            ))}
        </div>
    );

}

export default TimeCurrencyCard;