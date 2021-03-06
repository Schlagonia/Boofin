import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Popup from './Popup.js';
import link from './External_link.png';

function HarvestRestake(props) {

    const [ allApproved, setAllApproved ] = useState(false);
    const [ ting, setTing ] = useState(<p>Harvesting your Rewards!</p>)
    const [ harvested, setHarvested ] = useState(false);
    const [ stakedBoofi, setStakedBoofi ] = useState(false);
    const [ stakedZboofi, setStakedZBoofi ] = useState(false);
    const [ hash, setHash ] = useState();
    const [ loading, setLoading ] = useState(false);
    const { doIt, zboofi, boofi, wos, account, claimable } = props;
    const maxAllowance = '115792089237316195423570985008687907853269984665640564039454.032474440953267345';

    useEffect(() => {
        if(doIt === 1){
            harvestNStake()
        }
    }, [doIt])

    let content = (
        <div>
            Pending Transaction
            <div style={{ display: 'inlineFlex' }}>
                
                <a 
                    href={`https://snowtrace.io/tx/${hash}`} 
                    target="_blank" 
                    className="choice-link">
                    <img src={link} className="external-link"/>
                </a>
            </div>
        </div>
        )

    const harvest = async () => {
        try {
            // wos.harvest()
            //event 1 harvest
            //event 2 transfer
            let vesting = await wos.harvest();
            setHash(vesting.hash)
            setLoading(true)
            await vesting.wait();
            console.log('Vestings ', vesting)

            return true;
        } catch (error) {
            console.log(error)
        }
    }
  
    const approveBoofi = async () => {
        try {
            //approve boofi token to zboofi contract
            let proving = await boofi.appove(zboofi.address, maxAllowance);
            setHash(proving.hash)
            setLoading(true)
            await proving.wait()
            console.log('Boofi approved');
            
            return true;
        } catch (error) {
            console.log(error);
        }
    }
  
    const stakeBoofi = async () => {
        try{
            // zboofi.enter(amount)
            // event transfer from 0xx00 to account
            let bal = await boofi.balanceOf(account);
            
            let staken = await zboofi.enter(bal);
            setHash(staken.hash)
            setLoading(true)
            await staken.wait();
            console.log('Staked the boofi')

            return true;

        } catch (error) {
            console.log(error);
        }
    }
  
    const approveZboofi = async () => {
        try {
            //approve zboofi token to wos contract
            let proving = await zboofi.appove(wos.address, maxAllowance);
            setHash(proving.hash)
            setLoading(true)
            await proving.wait() 
            console.log('Zboofi Approved')
            
            return true;
        } catch (error) {
            console.log(error);
        }
    }
  
    const stakeZboofi = async () => {
        try{
            // wos.deposit(amount)
            let bal = await zboofi.balanceOf(account);

            let stakez = await wos.deposit(bal);
            setHash(stakez.hash)
            setLoading(true)
            await stakez.wait();
            console.log('Staked Zboofi')

            return true;
        } catch (error) {
            console.log(error);
        }
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
                return;
            }
            console.log('All approved');
            setAllApproved(true);

            let farmlife = await harvest();
            if(!farmlife) {
                alert('Harvest Failed, please try again')
                return;
            }
            
            setHarvested(true);

            let stakeLife = await stakeBoofi();
            if(!stakeLife) {
                alert('Staking failed, please try again')
                return;
            }
            setStakedBoofi(true);

            let stakedlifez = await stakeZboofi();
            if(!stakedlifez) {
                alert('StakingZ failed, please try again')
                return;
            }
            setStakedZBoofi(true);

            console.log('Staked all those muthafuckas')

            setLoading(false);
            setTing(<p>Rewards harvested and reinvested!</p>)

        } catch (error) {
            console.log(error); 
        }
    }

    return(
        <div className="popup-box">
            {loading && <Popup
                content={content}
                handleClose={() => setLoading(!loading)}

            />}
            <div className="box">
                <span className="close-icon" onClick={props.handleClose}>x</span>
                <p className="popup-title">Harvesting and Restaking your Boofi Rewards!</p>
                <p>This may take a few minutes and require multiple approvals and transactions</p> 
                {allApproved ? 
                    <div style={{ color : 'white' }}>
                        {String.fromCharCode(10004)} Approved
                    </div> 
                    : 
                    <div style={{ color : 'grey' }}>
                        X Approved
                    </div>
                }
                {harvested ? 
                    <div style={{ color : 'white' }}>
                        {String.fromCharCode(10004)} Harvested
                    </div> 
                    : 
                    <div style={{ color : 'grey' }}>
                        X Harvested
                    </div>
                }
                {stakedBoofi ? 
                    <div style={{ color : 'white' }}>
                        {String.fromCharCode(10004)} Staked Boofi
                    </div> 
                    : 
                    <div style={{ color : 'grey' }}>
                        X Staked Boofi
                    </div>
                }
                {stakedZboofi ? 
                    <div style={{ color : 'white' }}>
                        {String.fromCharCode(10004)} Deposit ZBoofi
                    </div> 
                    : 
                    <div style={{ color : 'grey' }}>
                        X Deposit ZBoofi
                    </div>
                }
                {ting}
                
            </div>
        </div>
    );
}

export default HarvestRestake;