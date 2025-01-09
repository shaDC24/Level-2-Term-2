import numpy as np
import matplotlib.pyplot as plt
import math
import os
class DiscreteSignal:
    def __init__(self, INF):
        self.INF = INF
        self.values = np.zeros(2 * INF + 1) 

    def set_value_at_time(self, time, value):
        if -self.INF <= time <= self.INF:
            self.values[time + self.INF] = value
        else:
            raise ValueError("Time index is out of range :(")

    def shift_signal(self, shift):
        if not isinstance(shift,(int,float)):
            raise ValueError("Shift time should be a number :(")
        shifted_values = np.roll(self.values, shift)
        time_shifted=abs(shift)
        if time_shifted>0:
            shifted_values[:time_shifted]=0
        elif time_shifted<0:
            shifted_values[-time_shifted:0]=0   
        return DiscreteSignal(self.INF).set_values(shifted_values)

    def set_values(self, values):
        self.values = values
        return self

    def add(self, other):
        if self.INF != other.INF:
            raise ValueError("Remember Signals must have the same infinity value :(")
        if not isinstance(other,DiscreteSignal):
            raise ValueError("Remember the other signal and the input signal should be of same instance :(")
        return DiscreteSignal(self.INF).set_values(self.values + other.values)

    def multiply(self, other):
        if self.INF != other.INF:
            raise ValueError("Remember Signals must have the same infinity value :(")
        if not isinstance(other,DiscreteSignal):
            raise ValueError("Remember the other signal and the input signal should be of same instance :(")
        return DiscreteSignal(self.INF).set_values(self.values * other.values)

    def multiply_const_factor(self, k):
        if not isinstance(k,(int,float)):
            raise ValueError("Remember the constant value must be a number :(")
        return DiscreteSignal(self.INF).set_values(self.values * k)

    def plot(self,title,saveTo=None):
        plt.stem(np.arange(-self.INF,self.INF+1),self.values)
        plt.grid(True)
        plt.xlabel('n (Time Index)')
        plt.ylabel('x[n]')
        plt.xticks(np.arange(-self.INF,self.INF+1))
        plt.yticks(np.arange(-1,5))
        plt.title(title)
        
        if saveTo is not None:
            plt.savefig(saveTo)
        plt.show() 
        
        
           
class LTI_Discrete:
    def __init__(self, impulse_response):
        if not isinstance(impulse_response, DiscreteSignal):
            raise ValueError("Impulse_response signal must be an instance of the same Discrete Signal :)")
        self.impulse_response = impulse_response

    def linear_combination_of_impulses(self, input_signal):
        if not isinstance(input_signal, DiscreteSignal):
            raise ValueError("Input signal signal must be an instance of the same Discrete Signal :)")
        impulses = []
        coefficients = []
        for i, value in enumerate(input_signal.values):
                shifted_unit_impulse=DiscreteSignal(input_signal.INF)
                shifted_unit_impulse.set_value_at_time(i-input_signal.INF,1)
                impulses.append((shifted_unit_impulse,i - input_signal.INF))
                coefficients.append(value)
        return impulses, coefficients

    def output(self, input_signal):
        if not isinstance(input_signal, DiscreteSignal):
            raise ValueError("Input signal signal must be an instance of the same Discrete Signal :)")
        impulses, coefficients = self.linear_combination_of_impulses(input_signal)
        output_signal = DiscreteSignal(input_signal.INF)
        for ((unit_impulse_at_the_time,time),coeff) in zip(impulses,coefficients):
            shifted_impulse = self.impulse_response.shift_signal(time)
            output_signal =output_signal.add(shifted_impulse.multiply_const_factor(coeff))
        return output_signal
    
    def subplots(self,output_subplot, signal,unit_impulses_time_values,coefficients, total_sum,sum_title,saveTo=None):
        fig, axs = plt.subplots(4, 3, figsize=(10, 8)) 
        if output_subplot==False:
            fig.suptitle("Impulse multiplied by coefficients")
        else:
            fig.suptitle("Response of Input Signal")     
        
        if output_subplot==True:
            this_signal=signal

        
        row=0
        col=0
        for i,((unit_impulse_at_the_time,time),coeff) in enumerate(zip(unit_impulses_time_values,coefficients)):
            if output_subplot==False:
                weighted_impulse = unit_impulse_at_the_time.multiply_const_factor(coeff)
            else:      
                shifted_signal=this_signal.shift_signal(time)
                weighted_impulse=shifted_signal.multiply_const_factor(coeff)
            
            total_sum+=weighted_impulse.values
            row=i//3
            col=i%3
            
            axs[row,col].stem(np.arange(-signal.INF, signal.INF + 1), weighted_impulse.values)
            if output_subplot==False:
                axs[row,col].set_title(f'δ[n - ({time})] * x[{time}]')
            else:
                axs[row, col].set_title(f'h[n - ({time})] * x[{time}]')    
            axs[row,col].set_xlabel('n (Time Index)')
            axs[row,col].set_ylabel('x[n]')
            axs[row,col].grid(True)
            axs[row, col].set_xticks(np.arange(-signal.INF, signal.INF + 1))
            axs[row, col].set_yticks(np.arange(-1, 5))   
        axs[3, 2].stem(np.arange(-signal.INF, signal.INF + 1), total_sum)
        axs[3, 2].set_title(sum_title)
        axs[3, 2].set_xlabel('n (Time Index)')
        axs[3, 2].set_ylabel('x[n]')
        axs[3, 2].set_xticks(np.arange(-signal.INF, signal.INF + 1))
        axs[3, 2].set_yticks(np.arange(-1, 5))
        axs[3, 2].grid(True)
        plt.tight_layout()
        if saveTo is not None:
            plt.savefig(saveTo)

        plt.show()        





class ContinuousSignal:
    def __init__(self, func):
        if not callable(func):
            raise ValueError("The function of Continuous Signal should be Callable :(")
        self.func = func

    def shift_signal(self, shift):
        if not isinstance(shift, (int, float)):
            raise ValueError("The shift value of Continuous Signal should be a Number :(")
        def shifted_func(t):
            return self.func(t - shift)
        return ContinuousSignal(shifted_func)

    def add(self, other):
        if not isinstance(other, ContinuousSignal):
            raise ValueError("Foe arithmetic operation both of the signal should be of same Instance :(")
        def added_func(t):
            return self.func(t) + other.func(t)
        return ContinuousSignal(added_func)

    def multiply(self, other):
        if not isinstance(other, ContinuousSignal):
            raise ValueError("Foe arithmetic operation both of the signal should be of same Instance :(")
        def multiplied_func(t):
            return self.func(t) * other.func(t)
        return ContinuousSignal(multiplied_func)

    def multiply_const_factor(self, k):
        if not isinstance(k, (int, float)):
            raise ValueError("For scale operation the scaling should be a number  :(")
        def multiplied_func_const(t):
            return self.func(t) * k
        return ContinuousSignal(multiplied_func_const)
    def plot(self,title,INF,saveTo=None):
        time_values = np.linspace(-INF, INF, 1000)
        y_values = [self.func(t) for t in time_values]
        plt.plot(time_values, y_values)
        plt.xlabel("t (Time)")
        plt.ylabel("x(t)")
        plt.title(title)
        plt.grid(True)
        plt.xticks(np.arange(-INF,INF+1))
        # plt.yticks(np.linspace(min(y_values), max(y_values)))
        if saveTo is not None:
            plt.savefig(saveTo)
        plt.show() 
        
               
class LTI_Continuous:
    def __init__(self, impulse_response):
        if not isinstance(impulse_response, ContinuousSignal):
            raise ValueError("Impulse_response signal must be an instance of the same Continuous Signal :)")
        self.impulse_response = impulse_response

    def linear_combination_of_impulses(self, input_signal, delta):
        if not isinstance(input_signal, ContinuousSignal):
            raise ValueError("Input signal must be an instance of the same Continuous Signal :)")
        if not isinstance(delta, (int, float)) or delta <= 0:
            raise ValueError("Delta should be a positive number . As much it tends to 0 that much we get the accuracy.")
        
        def impulse_signal_function(t,delta):
                return 1/delta if 0<=t<delta else 0
        impulse_signal = ContinuousSignal(lambda t: impulse_signal_function(t, delta))  
        
        INF= 3 # INF is here
        t_values = np.arange(-INF/delta, INF/delta, 1)*delta
        
        values=input_signal.func(t_values)
        impulses = []
        coefficients = []
        for i, value in enumerate(values):        
                impulses.append((impulse_signal.shift_signal(t_values[i]),t_values[i]))
                coefficients.append(value*delta)               
        return impulses, coefficients

    def output_approx(self, input_signal, delta):
        if not isinstance(input_signal, ContinuousSignal):
            raise ValueError("Input signal must be an instance of the same Continuous Signal :)")
        if not isinstance(delta, (int, float)) or delta <= 0:
            raise ValueError("Delta should be a positive number . As much it tends to 0 that much we get the accuracy.")
        
        impulses, coefficients = self.linear_combination_of_impulses(input_signal, delta)
        output_signal = ContinuousSignal(lambda t: 0)
        for ((shifted_unit_impulse, time),coeff) in zip(impulses,coefficients):
            shifted_impulse = self.impulse_response.shift_signal(time)
            output_signal = output_signal.add(shifted_impulse.multiply_const_factor(coeff)) 
           
        return output_signal 
    def subplots(self,output_subplot ,signal,unit_impulses_time_values,coefficients,INF,delta, sum_title,time_values,total_sum,saveTo=None):   
        t_values_to_Plot=np.arange(-2*INF,2*INF,1)*delta
        num_plots=len(t_values_to_Plot)
        num_cols = 3
        num_rows = math.ceil(num_plots / num_cols) +1
        if output_subplot==True:
            this_signal = signal
        fig, axs = plt.subplots(num_rows,num_cols, figsize=(12, 10))  
        fig.suptitle(sum_title)

        index_plot=0    
        
        for i, ((shifted_unit_impulse,time), coeff) in enumerate(zip(unit_impulses_time_values,coefficients)):
            
            if output_subplot==False:
                weighted_impulse = shifted_unit_impulse.multiply_const_factor(coeff)
            else:
                shifted_signal=this_signal.shift_signal(time)
                weighted_impulse=shifted_signal.multiply_const_factor(coeff)  

            y_values = np.array([weighted_impulse.func(tau)  for tau in time_values])
                
            total_sum +=( y_values)
            
            if  index_plot < len(t_values_to_Plot) and time == t_values_to_Plot[index_plot]:
                row = index_plot // 3
                col = index_plot % 3
                
                axs[row, col].plot(time_values,y_values)
                number=time/delta
                if output_subplot==False:
                    axs[row, col].set_title(f'δ(t - ({number:.2f}∇))x({number:.2f}∇)')
                else:
                    axs[row, col].set_title(f'h(t - ({number:.2f}∇))x({number:.2f}∇)')    
                axs[row, col].set_xlabel('t (Time)')
                axs[row, col].set_ylabel('x(t)')
                axs[row,col].set_xticks(np.arange(-INF,INF+1))
                axs[row,col].set_yticks(np.linspace(0,1,3))
                axs[row, col].grid(True)
                index_plot+=1
                         
        axs[-1, 0].plot(time_values, total_sum)
        if output_subplot==False:
            axs[-1, 0].set_title('Reconstructed Signal')
        else:   
            axs[-1, 0].set_title('Output=Sum')    
        axs[-1, 0].set_xlabel('t (Time)')
        axs[-1, 0].set_ylabel('x(t)')
        axs[-1,0].set_xticks(np.arange(-INF,INF+1))
        axs[-1,0].set_yticks(np.linspace(0,1,3))
        axs[-1, 0].grid(True)

        plt.tight_layout()
        plt.subplots_adjust(hspace=1.0, wspace=0.5)
        if saveTo is not None:
            plt.savefig(saveTo)
        plt.show() 
        
         



def main():
    img_root_path = './Discrete'
    os.makedirs(img_root_path, exist_ok=True)
    impulse_response_signal = DiscreteSignal(5) 
    impulse_response_signal.set_value_at_time(0, 1.0)  
    impulse_response_signal.set_value_at_time(1, 1.0) 
    impulse_response_signal.set_value_at_time(2, 1.0)  
    
    
   
    discrete_lti_system = LTI_Discrete(impulse_response_signal)

    discrete_signal = DiscreteSignal(5)
    discrete_signal.set_value_at_time(0, 0.5)
    discrete_signal.set_value_at_time(1, 2)
    
    discrete_signal.plot('x[n]',saveTo=f'{img_root_path}/x[n].png')
    impulse_response_signal.plot('Impulse response',saveTo=f'{img_root_path}/Impulse_response.png')
    

    unit_impulses_time_values, coefficients = discrete_lti_system.linear_combination_of_impulses(discrete_signal)
    total_sum=np.zeros(len(coefficients))

    discrete_lti_system.subplots(False,discrete_signal,unit_impulses_time_values,coefficients,total_sum,"Sum",saveTo=f'{img_root_path}/Impulse_Coeff_Mult_subplots.png')
    
  
    total_sum=np.zeros(len(coefficients))
    discrete_lti_system.subplots(True,impulse_response_signal,unit_impulses_time_values,coefficients,total_sum,"Output=Sum",saveTo=f'{img_root_path}/Respondse_Input_subplots.png')

    output_signal = discrete_lti_system.output(discrete_signal)
    output_signal.plot('Output Signal y[n]',saveTo=f'{img_root_path}/y[n].png')


    img_root_path = './Continuous'
    os.makedirs(img_root_path, exist_ok=True)
    deltas=[0.5,0.1,0.05,0.01]
    INF=3

    input_signal = ContinuousSignal(lambda t: np.exp(-t) * (t >= 0))
    input_signal.plot(f"x(t) , INF={INF}", INF,f'{img_root_path}/Continuos_Input_Signal.png')

        
    impulse_response = ContinuousSignal(lambda t: 1* (t >= 0))
    impulse_response.plot("Impulse Response", INF,f'{img_root_path}/Continuos_Impulse_Response_Signal.png')
    
    total_sum_list=[]

    for delta in (deltas):
        continuous_lti_system = LTI_Continuous(impulse_response)
        unit_impulses_time_values, coefficients = continuous_lti_system.linear_combination_of_impulses(input_signal, delta)
        
        time_values=np.linspace(-INF, INF+1e-5, 2000)
        total_sum = np.zeros(len(time_values))
        
        # def impulse_signal_function(t,delta):
        #         return 1/delta if 0<=t<delta else 0
        # impulse_signal = ContinuousSignal(lambda t: impulse_signal_function(t, delta))    
         
        continuous_lti_system.subplots(False,input_signal,unit_impulses_time_values, coefficients,INF,delta,f"Impulses multiplied by coefficients for delta={delta}",time_values,total_sum,saveTo=f'{img_root_path}/for delta={delta}_Impulse_Coeff_Mult_subplots.png')
        total_sum_list.append(total_sum)

        
            
    figmain, axsmain = plt.subplots(2, 2, figsize=(12, 10))  
    figmain.suptitle("Reconstruction of input signal with varying delta")
    axsmain=axsmain.flatten()

    for i,delta in enumerate(deltas): 
        total_sum=total_sum_list[i]    
        axsmain[i].plot(time_values, total_sum, label=f"Reconstructed", color='b', linestyle='-', linewidth=2)
        original_y_values = [input_signal.func(t) for t in time_values]
        axsmain[i].plot(time_values, original_y_values, label="x(t)", color=(1.0, 0.65, 0.0), linestyle='-', linewidth=2)  
        axsmain[i].set_title(f"∇={delta}")
        axsmain[i].set_xlabel("t (Time)")
        axsmain[i].set_ylabel("x(t)")
        axsmain[i].grid(True)
        axsmain[i].set_xticks(np.arange(-INF, INF + 1))
        # axsmain[i].set_yticks(np.linspace(0, 1, 3))
        axsmain[i].legend()
        
    plt.tight_layout()
    plt.savefig(f'{img_root_path}/Comparison_Reconstructed_vs_Original.png')
    plt.show()
    
    def u(t):
        return 1*(t >= 0)
    
    def true_output_func(t):
        if t < 0:
            return 0
        else:
            return (1 - np.exp(-t))*u(t)
        
 
    time_values=np.linspace(-INF, INF, 1000)
    
    for delta in deltas:
        total_sum=np.zeros(len(time_values))
        continuous_lti_system = LTI_Continuous(impulse_response)
        unit_impulses_time_values, coefficients = continuous_lti_system.linear_combination_of_impulses(input_signal, delta)
        continuous_lti_system.subplots(True,impulse_response,unit_impulses_time_values, coefficients,INF,delta,f"For delta={delta} Response of Impulse Signal",time_values,total_sum,saveTo=f'{img_root_path}/for delta={delta}_Impulse_REsponse_subplots.png')
      
    figmain, axsmain = plt.subplots(2, 2, figsize=(12, 10))
    figmain.suptitle("Approximation output as ∇ tends to 0")
    axsmain=axsmain.flatten()
         
    for i,delta in enumerate(deltas):
        approx_output_signal = continuous_lti_system.output_approx(input_signal, delta)
        approx_y_values = [approx_output_signal.func(t) for t in time_values]    
        axsmain[i].plot(time_values, approx_y_values, label=f"y_approx(t)(∇={delta})", color='b', linestyle='-', linewidth=2)
        original_y_values = [true_output_func(t) for t in time_values]
        axsmain[i].plot(time_values, original_y_values, label="y(t)=(1-e^(-t)u(t))", color=(1.0, 0.65, 0.0), linestyle='-', linewidth=2)  
        axsmain[i].set_title(f"∇={delta}")
        axsmain[i].set_xlabel("t (Time)")
        axsmain[i].set_ylabel("x(t)")
        axsmain[i].grid(True)
        axsmain[i].set_xticks(np.arange(-INF, INF + 1))
        # axsmain[i].set_yticks(np.linspace(0, 1, 3))
        axsmain[i].legend()
        
    plt.tight_layout()
    plt.savefig(f'{img_root_path}/approximation_vs_originaloutput.png')
    plt.show()    
    

if __name__=="__main__":
    main()   