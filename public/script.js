// handling generation ticket
const generateTicketButton = document.getElementById('generate-ticket-btn');
generateTicketButton.onclick = async function(e){
    e.preventDefault();

    const vin = document.getElementById('vin').value;
    const isBothWay = document.getElementsByName('waytype')[1].checked;
    const fromAddress = document.getElementById('from-address').value;
    const toAddress = document.getElementById('to-address').value;
    console.log(vin, vin.length);

    if(!(!!vin && vin.length === 15)){
        alert('VIN length should be 15');
        return;
    }

    if(!fromAddress || !toAddress || !fromAddress.length>0 || !toAddress.length>0){
        alert('Address is required!');
        return;
    }
    try{
        const response = await fetch('/api/receipt', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                "VIN" : vin,
                "fromAddress": fromAddress,
                "toAddress": toAddress,
                "isBothWay": isBothWay
            })
          });
        
        const generatedReceiptObject = await response.json();
        populateNewReceipt(generatedReceiptObject);
        alert(`receipt generated successfully with receipt ID ${generatedReceiptObject.receiptId}`);
    }catch(e){
        console.log(e);
        alert('Unable to generate receipt');
    }

}

// handling punch ticket

const ticketIdInputField = document.getElementById('ticket-id');
const seachButton = document.getElementById('search-button');
const ticketInfoParagraph = document.getElementById('ticket-info');
const punchTicketButtons = document.getElementById('punch-ticket-btns');

seachButton.onclick = async function(e) {
    const receiptId = ticketIdInputField.value;
    if(receiptId.length===0){
        alert('Please enter the receipt ID');
        return;
    }

    try{
        const response = await fetch(`/api/receipt/${receiptId}`, {
            method: 'GET',
        });
        
        const receiptObject = await response.json();
        populateNewReceipt(receiptObject);
    }catch(e){
        console.log(e);
        clearOldTicketInfo();
        alert('Unable to get receipt');
    }
}

function populateNewReceipt(receiptObject) {
    clearOldTicketInfo();

    ticketIdInputField.value = receiptObject.receiptId; 
    ticketInfoParagraph.innerHTML = 
                `<strong>Receipt ID:</strong> ${receiptObject.receiptId}<br>
                <strong>Date Created:</strong> ${new Date(receiptObject.generationTimeStamp)}<br>
                <strong>From Address:</strong> ${receiptObject.fromAddress}<br>
                <strong>To Address:</strong> ${receiptObject.toAddress}<br>
                <strong>Oneway or BothWay:</strong> ${receiptObject.isBothWay? 'BothWay' : 'Oneway'}<br>
                <strong>Completed</strong>: ${getCompletedRouteString(receiptObject)}`;
    
    if(!receiptObject.isRouteOneTaken){
        punchTicketButtons.insertAdjacentHTML( 'beforeend', 
        `<button type="button" class="btn btn-primary" id="punch-button">Punch Route 1</button>` );
        document.getElementById('punch-button').onclick = ()=>checkRoute(receiptObject.receiptId, 1);
    }else if(receiptObject.isBothWay && !receiptObject.isRouteTwoTaken){
        punchTicketButtons.insertAdjacentHTML( 'beforeend', 
        `<button type="button" class="btn btn-primary" id="punch-button">Punch Route 2</button>` );
        document.getElementById('punch-button').onclick = ()=>checkRoute(receiptObject.receiptId, 2);
    }
}

function getCompletedRouteString(receiptObject) {
    let completedRouteString = '';
    if(!(receiptObject.isRouteOneTaken || receiptObject.isRouteTwoTaken)) return 'No Route taken, please puch one'
    if(receiptObject.isRouteOneTaken){
        completedRouteString += receiptObject.fromAddress + ' to ' + receiptObject.toAddress;
    }
    if(receiptObject.isRouteTwoTaken){
        completedRouteString += ' & ' + receiptObject.toAddress + ' to ' + receiptObject.fromAddress;
    }
    return completedRouteString;
}

function clearOldTicketInfo() {
    ticketInfoParagraph.innerText = '';
    punchTicketButtons.innerHTML = '';
}

async function checkRoute(receiptId, routeNumber) {
    try{
        const response = await fetch('/api/receipt', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                "receiptId":receiptId,
                "routeNumber":routeNumber
            
            })
          });
        
        const modifiedReceiptObject = await response.json();
        populateNewReceipt(modifiedReceiptObject);
        alert(`Route ${routeNumber} punched successfully`)
    }catch(e){
        console.log(e);
        alert('Unable punch ticket');
    }
}