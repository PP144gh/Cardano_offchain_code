import type { UTxO, Asset, Data, Action } from '@martifylabs/mesh'

// TODO: Create a function that gets the balance of asset A at contract B.
// Use it to populate the Locking component, and to prevent use if assets are held.

export const getUtxoKoios = async (address: string) => {
    let _contract_utxos: UTxO[] = []
    const result = await fetch(`https://testnet.koios.rest/api/v0/address_info?_address=${address}`)
        .then((res) => res.json())

    if (result) {
        result[0].utxo_set?.map((utxo: { tx_index: number; tx_hash: string; datum_hash: string | undefined; asset_list: any; value: string }) => {
            const _asset_list = assetListFromKoios(utxo.asset_list, utxo.value)
            const u: UTxO = {
                input: {
                    outputIndex: utxo.tx_index,
                    txHash: utxo.tx_hash,
                },
                output: {
                    address: address,
                    amount: _asset_list,
                    dataHash: utxo.datum_hash,
                },
            }
            _contract_utxos.push(u)
        })
    }
    return _contract_utxos
}

const assetListFromKoios = (asset_list: any, lovelace: string) => {
    let _assets: Asset[] = [
        {
            unit: "lovelace",
            quantity: lovelace
        }
    ]
    asset_list.map((asset: { policy_id: string; asset_name: string; quantity: string; }) => {
        const unit: string = asset.policy_id.concat(asset.asset_name)
        let a: Asset = {
            unit: unit,
            quantity: asset.quantity
        }
        _assets.push(a)
    })
    return _assets
}