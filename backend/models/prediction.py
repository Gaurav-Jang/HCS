class Prediction:
    """
    Dummy class for storing prediction data.
    Replace with real DB logic if needed.
    """
    def __init__(self):
        self.storage = []
        self.counter = 1

    def create_prediction(self, data):
        data['prediction_id'] = self.counter
        self.storage.append(data)
        self.counter += 1
        return data['prediction_id']

    def get_all_predictions(self):
        return self.storage
