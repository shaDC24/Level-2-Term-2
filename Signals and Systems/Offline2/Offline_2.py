import numpy as np
import matplotlib.pyplot as plt
from scipy.signal import sawtooth

class FourierSeries:
    def __init__(self, func, L, terms=10):
        """
        Initialize the FourierSeries class with a target function, period L, and number of terms.
        
        Parameters:
        - func: The target function to approximate.
        - L: Half the period of the target function.
        - terms: Number of terms to use in the Fourier series expansion.
        """
        self.func=func
        self.L=L
        self.terms=terms
     

    def calculate_a0(self, N=1000):
        """
        Step 1: Compute the a0 coefficient, which is the average (DC component) of the function over one period.
        
        You need to integrate the target function over one period from -L to L.
        For that, you can use the trapezoidal rule with a set of points (N points here) for numerical integration.
        
        Parameters:
        - N: Number of points to use for integration (more points = more accuracy).
        
        Returns:
        - a0: The computed a0 coefficient.
        """
        x=np.linspace(-self.L, self.L, N)
        y=self.func(x)
        a0=(1/(self.L))*np.trapz(y,x)
        return a0

    def calculate_an(self, n, N=1000):
        """
        Step 2: Compute the an coefficient for the nth cosine term in the Fourier series.
        
        You need to integrate the target function times cos(n * pi * x / L) over one period.
        This captures how much of the nth cosine harmonic is present in the function.
        
        Parameters:
        - n: Harmonic number to calculate the nth cosine coefficient.
        - N: Number of points to use for numerical integration.
        
        Returns:
        - an: The computed an coefficient.
        """
        x=np.linspace(-self.L, self.L, N)
        y=self.func(x)
        a_n=(1/self.L)*np.trapz(y*np.cos((n*np.pi*x)/self.L),x)
        return a_n
    

    def calculate_bn(self, n, N=1000):
        """
        Step 3: Compute the bn coefficient for the nth sine term in the Fourier series.
        
        You need to integrate the target function times sin(n * pi * x / L) over one period.
        This determines the contribution of the nth sine harmonic in the function.
        
        Parameters:
        - n: Harmonic number to calculate the nth sine coefficient.
        - N: Number of points to use for numerical integration.
        
        Returns:
        - bn: The computed bn coefficient.
        """
        x=np.linspace(-self.L, self.L, N)
        y=self.func(x)
        b_n=(1/self.L)*np.trapz(y*np.sin((n*np.pi*x)/self.L),x)
        return b_n

    def approximate(self, x):
        """
        Step 4: Use the calculated coefficients to build the Fourier series approximation.
        
        For each term up to the specified number of terms, you need to calculate the sum of:
        a0 (the constant term) + cosine terms (an * cos(n * pi * x / L)) + sine terms (bn * sin(n * pi * x / L)).
        
        Parameters:
        - x: Points at which to evaluate the Fourier series.
        
        Returns:
        - The Fourier series approximation evaluated at each point in x.
        """
        # Compute a0 term
        a_0=self.calculate_a0()
        # Initialize the series with the a0 term
        result=(a_0/2)
        # Compute each harmonic up to the specified number of terms
        for n in range(1,self.terms+1):
            a_n=self.calculate_an(n)
            b_n=self.calculate_bn(n)
            result+=a_n*(np.cos((n*np.pi*x)/self.L))+b_n*(np.sin((n*np.pi*x)/self.L))

        return result




    def plot(self):
        """
        Step 5: Plot the original function and its Fourier series approximation.
        
        You need to calculate the Fourier series approximation over a set of points (x values) from -L to L.
        Then plot both the original function and the Fourier series to visually compare them.
        """
        # Generate points over one period
        # Compute original function values
        # Compute Fourier series approximation

        
        x=np.linspace(-self.L,self.L,1000) # Implement this line
        original = self.func(x) # Implement this line
        approximation = self.approximate(x) # Implement this line

        # Plotting
        plt.figure(figsize=(10, 6))
        plt.plot(x, original, label="Original Function", color="blue")
        plt.plot(x, approximation, label=f"Fourier Series Approximation (N={self.terms})", color="red", linestyle="--")
        plt.xlabel("x")
        plt.ylabel("f(x)")
        plt.legend()
        plt.title("Fourier Series Approximation")
        plt.grid(True)
        plt.show()


def target_function(x, function_type="square"):
    """
    Defines various periodic target functions that can be used for Fourier series approximation.
    
    Parameters:
    - x: Array of x-values for the function.
    - function_type: Type of function to use ("square", "sawtooth", "triangle", "sine", "cosine").
    
    Returns:
    - The values of the specified target function at each point in x.
    """
    period=np.pi*2
    if function_type == "square":
        # Square wave: +1 when sin(x) >= 0, -1 otherwise
        return np.where(np.sin(x)>=0,1,-1)
        
    
    elif function_type == "sawtooth":
        # Sawtooth wave: linearly increasing from -1 to 1 over the period
        return 2 * (x / period - np.floor(x / period + 0.5))
        # return sawtooth(x)
        
    
    elif function_type == "triangle":
        # Triangle wave: periodic line with slope +1 and -1 alternately
        return 2 * np.abs(2 * (x / period - np.floor(x / period + 0.5))) - 1
        # return sawtooth(x,0.5)
    
        
    
    elif function_type == "sine":
        # Pure sine wave
        return np.sin(x)
      

    
    elif function_type == "cosine":
        # Pure cosine wave
        return np.cos(x)
      
    
    else:
        raise ValueError("Invalid function_type. Choose from 'square', 'sawtooth', 'triangle', 'sine', or 'cosine'.")

# Example of using these functions in the FourierSeries class
if __name__ == "__main__":
    L = np.pi  # Half-period for all functions
    terms = 10  # Number of terms in Fourier series

    # Test each type of target function
    for function_type in ["square", "sawtooth", "triangle", "sine", "cosine"]:
        print(f"Plotting Fourier series for {function_type} wave:")
        # Define the target function dynamically
        fourier_series = FourierSeries(lambda x: target_function(x, function_type=function_type), L, terms) 
        # Plot the Fourier series approximation
        fourier_series.plot()
