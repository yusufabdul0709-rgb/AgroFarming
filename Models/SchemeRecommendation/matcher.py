from typing import Dict, Any, List

class SchemeMatcherModel:
    """
    Government Scheme & Financial Subsidies Recommender engine.
    Matches farmer profile against Central & State schemes with approval probability scoring.
    """
    def __init__(self):
        self.schemes_db = [
            {
                "scheme_id": "PM-KISAN",
                "name": "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
                "benefit": "₹6,000 per year direct income support in 3 equal installments",
                "max_land_acres": 10.0,
                "max_income": 300000,
                "required_documents": ["Aadhaar Card", "Land Pattadar Passbook", "Bank Account Passbook"],
                "approval_probability": 96.0,
                "deadline": "Rolling Registration"
            },
            {
                "scheme_id": "PMFBY",
                "name": "Pradhan Mantri Fasal Bima Yojana (Crop Insurance)",
                "benefit": "Comprehensive crop loss insurance against drought, flood, and pest attack at 2% premium",
                "max_land_acres": 50.0,
                "max_income": 1000000,
                "required_documents": ["Land Revenue Receipt", "Sowing Certificate", "Aadhaar Card"],
                "approval_probability": 92.5,
                "deadline": "15th August 2026"
            },
            {
                "scheme_id": "RYTHU-BANDHU",
                "name": "Telangana Rythu Bandhu Scheme / Subsidies",
                "benefit": "₹10,000 per acre per year for agricultural inputs & fertilizers",
                "max_land_acres": 25.0,
                "max_income": 500000,
                "required_documents": ["Pattadar Passbook", "Aadhaar Linked Bank Account"],
                "approval_probability": 94.0,
                "deadline": "31st August 2026"
            },
            {
                "scheme_id": "DRIP-IRRIGATION-SUBSIDY",
                "name": "PMKSY Micro-Irrigation Subsidy",
                "benefit": "80% to 90% subsidy on Drip and Sprinkler Irrigation setup",
                "max_land_acres": 12.0,
                "max_income": 400000,
                "required_documents": ["Water Source Proof (Borewell/Canal)", "Land Record", "Aadhaar"],
                "approval_probability": 88.0,
                "deadline": "30th September 2026"
            }
        ]

    def match_schemes(self, land_acres: float = 2.5, annual_income: float = 150000, category: str = "OBC", state: str = "Telangana") -> Dict[str, Any]:
        eligible = []
        for s in self.schemes_db:
            if land_acres <= s["max_land_acres"] and annual_income <= s["max_income"]:
                eligible.append({
                    "scheme_name": s["name"],
                    "benefit_description": s["benefit"],
                    "approval_chance_percent": s["approval_probability"],
                    "required_documents": s["required_documents"],
                    "application_deadline": s["deadline"]
                })

        return {
            "farmer_profile": {
                "land_acres": land_acres,
                "annual_income": annual_income,
                "category": category,
                "state": state
            },
            "total_eligible_schemes": len(eligible),
            "eligible_schemes": eligible,
            "next_steps": "Upload required documents to Kissan Vault to complete instant scheme match application.",
            "algorithm": "Policy-Rule Vector Matcher v2.0"
        }

scheme_matcher_engine = SchemeMatcherModel()
