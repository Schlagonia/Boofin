import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

function HarvestRestake(props) {

    const [ content, setContent ] = useState(<p>Harvesting your Rewards!</p>);
    const { doIt, zboofi, boofi, wos, account, claimable } = props;
    const maxAllowance = ''

    useEffect(() => {
        if(doIt === 1){
            harvestNStake()
        }
    }, [doIt])

    const harvest = () => {
        // wos.harvest()
        //event 1 harvest
        //event 2 transfer
    }
  
    const approveBoofi = async () => {
        //approve boofi token to zboofi contract
        await boofi.appove(zboofi.address, maxAllowance);
        console.log('Boofi approved');
        return true;
    }
  
    const stakeBoofi = () => {
        // zboofi.enter(amount)
        // event transfer from 0xx00 to account
    }
  
    const approveZboofi = async () => {
        //approve zboofi token to wos contract
        await zboofi.appove(wos.address, maxAllowance);
        console.log('Zboofi Approved')
        return true;
    }
  
    const stakeZboofi = () => {
        // wos.deposit(amount)
    }

    const checkApprovals = async () => {
        try{
            let boofiApproved = await boofi.allowance(account, zboofi.address);
            console.log('boofi approved is ', ethers.utils.formatEther(boofiApproved))
            if(claimable < boofiApproved) {
                let boofiApproval = await approveBoofi();
            }

            let zboofiApproved = await zboofi.allowance(account, wos.address)
            console.log('Zboofi approbal is', ethers.utils.formatEther(zboofiApproved));
            let needed = await zboofi.expectedZBOOFI(claimable);
            if(needed < zboofiApproved) {
                let zboofiApproval = await approveZboofi();
            }

            return true;


        } catch(error) {
            console.log(error)
        }
    }
    
    const harvestNStake = async () => {
        
        try{

            let approved = await checkApprovals();

            if(!approved) {
                alert('Approvals Failed, please try again');
            }
            console.log('All approved');
            


        } catch (error) {
            console.log(error); 
        }
    }

    return(
        <div className="popup-box">
            <div className="box">
                <span className="close-icon" onClick={props.handleClose}>x</span>
                <p className="popup-title">Harvesting and Restaking your Boofi Rewards!</p>
                <p>This may take a few minutes and require multiple transactions and approvals</p> 
                {content}
            </div>
        </div>
    );
}

export default HarvestRestake;