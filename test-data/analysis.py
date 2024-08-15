import pandas as pd

# Load the CSV file into a Pandas DataFrame
data = pd.read_csv('rider_data.csv')

# Separate data for fatigued and non-fatigued sessions (if there's an identifier)
fatigued_sessions = data[data['fatigue_status'] == 'fatigued']
non_fatigued_sessions = data[data['fatigue_status'] == 'non-fatigued']

# Create a safety metric based on weighted combination
fatigued_sessions['safety_metric'] = 0.4 * fatigued_sessions['hard_brake'] + 0.4 * fatigued_sessions['speed_infraction'] + 0.2 * fatigued_sessions['perclos_score']
non_fatigued_sessions['safety_metric'] = 0.4 * non_fatigued_sessions['hard_brake'] + 0.4 * non_fatigued_sessions['speed_infraction'] + 0.2 * non_fatigued_sessions['perclos_score']

# Calculate the mean safety metric for fatigued and non-fatigued sessions
avg_safety_metric_fatigued = fatigued_sessions['safety_metric'].mean()
avg_safety_metric_non_fatigued = non_fatigued_sessions['safety_metric'].mean()

from scipy.stats import ttest_ind

# Perform t-test for the safety metric
t_stat_safety_metric, p_value_safety_metric = ttest_ind(
    fatigued_sessions['safety_metric'], non_fatigued_sessions['safety_metric']
)

results = pd.DataFrame({
    'Metric': ['Safety Metric'],
    'Average (Fatigued)': [avg_safety_metric_fatigued],
    'Average (Non-Fatigued)': [avg_safety_metric_non_fatigued],
    'T-Test (p-value)': [p_value_safety_metric],
})

# Show the results DataFrame
print(results)
print("Threshold Value: " ,(avg_safety_metric_fatigued + avg_safety_metric_non_fatigued) / 2)