{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TypeApplications #-}

module Ppbl.PpblCompiler where

import Cardano.Api
import Cardano.Api.Shelley (PlutusScript (..))
import Codec.Serialise (serialise)
import Data.Aeson
import qualified Data.ByteString.Lazy as LBS
import qualified Data.ByteString.Short as SBS
import qualified Ledger

import Plutus.V1.Ledger.Api (Data (B, Constr, I, List, Map), ToData, toData)

import Ppbl.PpblValidator

dataToScriptData :: Data -> ScriptData
dataToScriptData (Constr n xs) = ScriptDataConstructor n $ dataToScriptData <$> xs
dataToScriptData (I n) = ScriptDataNumber n
dataToScriptData (B b) = ScriptDataBytes b
dataToScriptData (Map xs) = ScriptDataMap [(dataToScriptData k, dataToScriptData v) | (k, v) <- xs]
dataToScriptData (List xs) = ScriptDataList $ fmap dataToScriptData xs

writeJson :: ToData a => FilePath -> a -> IO ()
writeJson file = LBS.writeFile file . encode . scriptDataToJson ScriptDataJsonDetailedSchema . dataToScriptData . toData

writePpblDatum :: IO ()
writePpblDatum = writeJson "src/Ppbl/output/PpblDatum.json" $ PpblDatum
  {
    sellerAddress = "28aa91362e76dbbc6537e3eea59e6aa660b3b119d8a032122b494f9f"
  , buyerAddress  = "06bf9b700f28b41eb857ff5d9834d49372752f018c81f6b274fe50e0"
  , priceAmount   = 20000000
  , cancelFees    = 5000000
  
  }

writeValidator :: FilePath -> Ledger.Validator -> IO (Either (FileError ()) ())
writeValidator file = writeFileTextEnvelope @(PlutusScript PlutusScriptV1) file Nothing . PlutusScriptSerialised . SBS.toShort . LBS.toStrict . serialise . Ledger.unValidatorScript

-- writePpblScript : Used to create the Plutus Script

writePpblScript :: IO (Either (FileError ()) ())
writePpblScript = writeValidator "src/Ppbl/output/MySecondValidator.plutus" $ Ppbl.PpblValidator.validator $ PpblParameters
    {
      ownerAddress = "3460f0c364cb92023f0d6d647da4c78c77e552787a57c6b93b255889"
    , ownerCut     = 2000000
    }
