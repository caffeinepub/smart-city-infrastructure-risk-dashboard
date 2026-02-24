import Map "mo:core/Map";
import Text "mo:core/Text";

module {
  type StructureType = {
    #bridge;
    #road;
  };

  type MaterialType = {
    #concrete;
    #steel;
    #asphalt;
    #compositeMaterial;
  };

  type RiskLevel = {
    #low;
    #moderate;
    #high;
  };

  type OldInfrastructure = {
    id : Text;
    name : Text;
    structureType : StructureType;
    location : {
      area : Text;
      latitude : Float;
      longitude : Float;
    };
    age : Nat;
    trafficLoadFactor : Float;
    materialType : MaterialType;
    environmentalExposureFactor : Float;
    structuralConditionRating : Float;
    notes : Text;
    riskScore : Float;
    riskLevel : RiskLevel;
  };

  type OldActor = {
    infrastructure : Map.Map<Text, OldInfrastructure>;
    syntheticData : [OldInfrastructure];
  };

  type NewInfrastructure = {
    id : Text;
    name : Text;
    structureType : StructureType;
    location : {
      area : Text;
      latitude : Float;
      longitude : Float;
    };
    age : Nat;
    trafficLoadFactor : Float;
    materialType : MaterialType;
    environmentalExposureFactor : Float;
    structuralConditionRating : Float;
    notes : Text;
    riskScore : Float;
    riskLevel : RiskLevel;
    photoBase64 : ?Text;
  };

  type NewActor = {
    infrastructure : Map.Map<Text, NewInfrastructure>;
  };

  public func run(old : OldActor) : NewActor {
    let newInfrastructure = old.infrastructure.map<Text, OldInfrastructure, NewInfrastructure>(
      func(_id, oldInfra) {
        { oldInfra with photoBase64 = null };
      }
    );
    { infrastructure = newInfrastructure };
  };
};
