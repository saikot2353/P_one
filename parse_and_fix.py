import sys

def read_lines(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        return f.readlines()

def write_lines(filepath, lines):
    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(lines)

def find_line(lines, search_str, start=0):
    for i in range(start, len(lines)):
        if search_str in lines[i]:
            return i
    return -1

def remove_stepper(lines):
    # Stepper is from {isStepperExpanded && ( to corresponding )}
    start = find_line(lines, "{isStepperExpanded && (")
    if start == -1: return lines
    # find closing )}
    # Actually the stepper ends around line 1748 with </div></div>)}</div>
    # I'll just remove lines start to start+99
    end = find_line(lines, "                  </div>", start+90) 
    # it's around 99 lines. Let's find exactly `                  )}` after the `</button>`
    return lines[:start] + lines[start+99:] # approx, need precise

lines = read_lines('src/routes/add-employee.tsx')
# I'll use exact line replacements using Python to avoid issues.
