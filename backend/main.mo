import Map "mo:core/Map";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Float "mo:core/Float";
import Int "mo:core/Int";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

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

  type UrgencyLevel = {
    #immediateRepair;
    #scheduledMaintenance;
    #monitorOnly;
  };

  type InfrastructureInput = {
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
    photoBase64 : ?Text;
  };

  type Infrastructure = {
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

  type Prediction = {
    futureConditionRatings : {
      rating5 : Float;
      rating10 : Float;
      rating20 : Float;
    };
    maintenanceYear : Nat;
    deteriorationRate : Float;
  };

  type BudgetEstimate = {
    estimatedCost : Float;
    urgencyLevel : UrgencyLevel;
    recommendedAction : Text;
  };

  type PredictionResult = {
    riskScore : Float;
    riskLevel : RiskLevel;
    deteriorationRate : Float;
    maintenanceYear : Nat;
    budgetEstimate : BudgetEstimate;
  };

  type CityBudgetSummary = {
    totalEstimatedBudget : Float;
    breakdownByRiskLevel : {
      low : Float;
      moderate : Float;
      high : Float;
    };
    topPriorityStructures : [Infrastructure];
  };

  module Infrastructure {
    public func calculateRiskScore(infra : Infrastructure) : Float {
      let ageFactor = infra.age.toInt().toFloat() / 80.0;
      let inverseConditionRating = 1.0 - (infra.structuralConditionRating / 5.0);

      (ageFactor * 0.30) +
      (infra.trafficLoadFactor * 0.25) +
      (infra.environmentalExposureFactor * 0.15) +
      (inverseConditionRating * 0.10);
    };

    public func determineRiskLevel(riskScore : Float) : RiskLevel {
      if (riskScore < 0.34) {
        #low;
      } else if (riskScore < 0.67) {
        #moderate;
      } else {
        #high;
      };
    };

    public func compareByRisk(infra1 : Infrastructure, infra2 : Infrastructure) : Order.Order {
      switch (Float.compare(infra2.riskScore, infra1.riskScore)) {
        case (#equal) { infra1.id.compare(infra2.id) };
        case (order) { order };
      };
    };
  };

  let infrastructure = Map.empty<Text, Infrastructure>();

  public shared ({ caller }) func initializeData() : async () {
    let syntheticData : [Infrastructure] = [
      {
        id = "1";
        name = "Central Bridge";
        structureType = #bridge;
        location = {
          area = "Downtown";
          latitude = 40.7128;
          longitude = -74.0060;
        };
        age = 45;
        trafficLoadFactor = 0.8;
        materialType = #steel;
        environmentalExposureFactor = 0.7;
        structuralConditionRating = 3.2;
        notes = "Historical significance";
        riskScore = 0.65;
        riskLevel = #moderate;
        photoBase64 = null;
      },
      {
        id = "2";
        name = "Riverside Road";
        structureType = #road;
        location = {
          area = "Uptown";
          latitude = 40.7306;
          longitude = -73.9352;
        };
        age = 12;
        trafficLoadFactor = 0.6;
        materialType = #asphalt;
        environmentalExposureFactor = 0.5;
        structuralConditionRating = 4.1;
        notes = "High traffic during rush hours";
        riskScore = 0.38;
        riskLevel = #moderate;
        photoBase64 = null;
      },
    ];

    for (infra in syntheticData.values()) {
      infrastructure.add(infra.id, infra);
    };
  };

  public shared ({ caller }) func addInfrastructure(input : InfrastructureInput) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add infrastructure");
    };
    if (infrastructure.containsKey(input.id)) {
      Runtime.trap("Infrastructure with this ID already exists");
    };

    let newInfra : Infrastructure = {
      input with
      riskScore = calculateRiskScoreInput(input);
      riskLevel = Infrastructure.determineRiskLevel(calculateRiskScoreInput(input));
    };

    infrastructure.add(input.id, newInfra);
  };

  public shared ({ caller }) func updateInfrastructure(id : Text, input : InfrastructureInput) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update infrastructure");
    };
    if (not infrastructure.containsKey(id)) {
      Runtime.trap("Infrastructure with this ID does not exist");
    };

    let updatedInfra : Infrastructure = {
      input with
      riskScore = calculateRiskScoreInput(input);
      riskLevel = Infrastructure.determineRiskLevel(calculateRiskScoreInput(input));
    };

    infrastructure.add(id, updatedInfra);
  };

  func calculateRiskScoreInput(input : InfrastructureInput) : Float {
    let ageFactor = input.age.toInt().toFloat() / 80.0;
    let inverseConditionRating = 1.0 - (input.structuralConditionRating / 5.0);

    (ageFactor * 0.30) +
    (input.trafficLoadFactor * 0.25) +
    (input.environmentalExposureFactor * 0.15) +
    (inverseConditionRating * 0.10);
  };

  public shared ({ caller }) func deleteInfrastructure(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete infrastructure");
    };
    if (not infrastructure.containsKey(id)) {
      Runtime.trap("Infrastructure with this ID does not exist");
    };

    infrastructure.remove(id);
  };

  public query ({ caller }) func getAllInfrastructure() : async [Infrastructure] {
    infrastructure.values().toArray();
  };

  public query ({ caller }) func getInfrastructureById(id : Text) : async Infrastructure {
    switch (infrastructure.get(id)) {
      case (null) { Runtime.trap("Infrastructure with this ID does not exist") };
      case (?infra) { infra };
    };
  };

  public query ({ caller }) func getPredictions(id : Text) : async Prediction {
    switch (infrastructure.get(id)) {
      case (null) { Runtime.trap("Infrastructure with this ID does not exist") };
      case (?infra) {
        let deteriorationRate = (1.0 - infra.structuralConditionRating) / (infra.age.toInt().toFloat() * 5.1);
        let futureConditionRatings = {
          rating5 = infra.structuralConditionRating - (deteriorationRate * 5.0);
          rating10 = infra.structuralConditionRating - (deteriorationRate * 10.0);
          rating20 = infra.structuralConditionRating - (deteriorationRate * 20.0);
        };
        let yearsUntilCritical = Float.abs((3.0 - infra.structuralConditionRating) / deteriorationRate);
        let maintenanceYear = infra.age + yearsUntilCritical.toInt().toNat();

        {
          futureConditionRatings;
          maintenanceYear;
          deteriorationRate;
        };
      };
    };
  };

  public query ({ caller }) func getBudgetEstimate(id : Text) : async BudgetEstimate {
    switch (infrastructure.get(id)) {
      case (null) { Runtime.trap("Infrastructure with this ID does not exist") };
      case (?infra) {
        let baseCost = switch (infra.structureType) {
          case (#bridge) { 150_000 };
          case (#road) { 50_000 };
        };
        let riskMultiplier = switch (infra.riskLevel) {
          case (#low) { 1.0 };
          case (#moderate) { 1.5 };
          case (#high) { 2.5 };
        };
        let estimatedCost = baseCost.toFloat() * riskMultiplier * (infra.age.toInt().toFloat() / 20.0);

        let urgencyLevel = switch (infra.riskLevel) {
          case (#low) { #monitorOnly };
          case (#moderate) { #scheduledMaintenance };
          case (#high) { #immediateRepair };
        };

        let recommendedAction = switch (infra.riskLevel) {
          case (#low) { "Monitor Only" };
          case (#moderate) { "Schedule Maintenance" };
          case (#high) { "Immediate Repair" };
        };

        {
          estimatedCost;
          urgencyLevel;
          recommendedAction;
        };
      };
    };
  };

  public query ({ caller }) func getCityBudgetSummary() : async CityBudgetSummary {
    let allInfra = infrastructure.values().toArray();

    let totalEstimatedBudget = allInfra.foldLeft(
      0.0,
      func(acc, infra) {
        let baseCost = switch (infra.structureType) {
          case (#bridge) { 150_000 };
          case (#road) { 50_000 };
        };
        let riskMultiplier = switch (infra.riskLevel) {
          case (#low) { 1.0 };
          case (#moderate) { 1.5 };
          case (#high) { 2.5 };
        };
        acc + (baseCost.toFloat() * riskMultiplier * (infra.age.toInt().toFloat() / 20.0));
      },
    );

    let breakdownByRiskLevel = {
      low = allInfra
        .filter(func(infra) { infra.riskLevel == #low })
        .foldLeft(0.0, func(acc, infra) { acc + infra.riskScore });

      moderate = allInfra
        .filter(func(infra) { infra.riskLevel == #moderate })
        .foldLeft(0.0, func(acc, infra) { acc + infra.riskScore });

      high = allInfra
        .filter(func(infra) { infra.riskLevel == #high })
        .foldLeft(0.0, func(acc, infra) { acc + infra.riskScore });
    };

    let topPriorityStructures = allInfra.sort(Infrastructure.compareByRisk);

    {
      totalEstimatedBudget;
      breakdownByRiskLevel;
      topPriorityStructures;
    };
  };

  func analyzeImage(imageBase64 : ?Text) : Float {
    switch (imageBase64) {
      case (null) { 2.5 };
      case (?base64) {
        let length = base64.size();
        var hashValue = 0;

        for (char in base64.chars()) {
          hashValue += char.toNat32().toNat();
        };

        let normalizedHash = (hashValue % 100000).toFloat() / 100000.0;

        2.5 + (normalizedHash * 2.5);
      };
    };
  };

  func getMaterialFactor(materialType : MaterialType) : Float {
    switch (materialType) {
      case (#concrete) { 0.8 };
      case (#steel) { 1.0 };
      case (#asphalt) { 1.2 };
      case (#compositeMaterial) { 0.9 };
    };
  };

  func calculateRiskLevel(riskScore : Float) : {
    riskLevel : RiskLevel;
    urgencyLevel : UrgencyLevel;
    recommendedAction : Text;
  } {
    let (riskLevel, urgencyLevel, recommendedAction) =
      if (riskScore < 0.34) {
        (#low, #monitorOnly, "Monitor Only");
      } else if (riskScore < 0.67) {
        (#moderate, #scheduledMaintenance, "Schedule Maintenance");
      } else {
        (#high, #immediateRepair, "Immediate Repair");
      };

    {
      riskLevel;
      urgencyLevel;
      recommendedAction;
    };
  };

  public query ({ caller }) func analyzeAndPredict(input : InfrastructureInput) : async PredictionResult {
    let imageScore = analyzeImage(input.photoBase64);

    let materialFactor = getMaterialFactor(input.materialType);
    let ageFactor = input.age.toInt().toFloat() / 80.0;
    let inverseConditionRating = 1.0 - (imageScore / 5.0);

    let riskScore = (ageFactor * 0.30) +
    (input.trafficLoadFactor * 0.25) +
    (input.environmentalExposureFactor * 0.15) +
    (materialFactor * 0.15) +
    (inverseConditionRating * 0.10);

    let deteriorationRate = (1.0 - imageScore) / (input.age.toInt().toFloat() * 5.1);

    let yearsUntilCritical = Float.max(0, Float.abs((3.0 - imageScore) / deteriorationRate));
    let maintenanceYear = input.age + yearsUntilCritical.toInt().toNat();

    let baseCost = switch (input.structureType) {
      case (#bridge) { 150_000 };
      case (#road) { 50_000 };
    };

    let riskMultiplier = if (riskScore < 0.34) {
      1.0;
    } else if (riskScore < 0.67) {
      1.5;
    } else {
      2.5;
    };

    let estimatedCost = baseCost.toFloat() * riskMultiplier * (input.age.toInt().toFloat() / 20.0);

    let { riskLevel; urgencyLevel; recommendedAction } = calculateRiskLevel(riskScore);

    let budgetEstimate = {
      estimatedCost;
      urgencyLevel;
      recommendedAction;
    };

    {
      riskScore;
      riskLevel;
      deteriorationRate;
      maintenanceYear;
      budgetEstimate;
    };
  };
};
